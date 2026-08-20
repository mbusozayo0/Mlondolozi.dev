import { ContactShadows, Html, SoftShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { glassMaterial, materials } from "./materials";
import { useExperienceStore } from "./store";

type Vector3Tuple = [number, number, number];

function GoldenHourEnvironment() {
  const { scene } = useThree();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext("2d")!;
    const sky = context.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#202a34");
    sky.addColorStop(0.48, "#8b7565");
    sky.addColorStop(0.66, "#d79b65");
    sky.addColorStop(1, "#29231f");
    context.fillStyle = sky;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const sun = context.createRadialGradient(96, 145, 2, 96, 145, 62);
    sun.addColorStop(0, "rgba(255,242,202,1)");
    sun.addColorStop(0.15, "rgba(255,194,116,.75)");
    sun.addColorStop(1, "rgba(255,160,72,0)");
    context.fillStyle = sun;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.environment = texture;
    scene.environmentIntensity = 0.38;

    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [scene]);

  return null;
}

function CameraRig() {
  const progress = useExperienceStore((state) => state.progress);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    const approach = THREE.MathUtils.smoothstep(progress, 0.06, 0.5);
    const reveal = THREE.MathUtils.smoothstep(progress, 0.48, 0.64);
    const seatedReveal = THREE.MathUtils.smoothstep(progress, 0.71, 0.735);
    const focus = THREE.MathUtils.smoothstep(progress, 0.76, 0.94);
    const bodyMotionWeight = 1 - THREE.MathUtils.smoothstep(progress, 0.44, 0.56);
    const walkCycle = progress * Math.PI * 20;
    const bob = Math.sin(walkCycle * 2) * 0.01 * bodyMotionWeight;
    const footfall = Math.abs(Math.sin(walkCycle)) * 0.008 * bodyMotionWeight;
    const sway = Math.sin(walkCycle) * 0.009 * bodyMotionWeight;
    const approachX = THREE.MathUtils.lerp(0.38, 0.58, approach);
    const approachZ = THREE.MathUtils.lerp(7.3, -0.95, approach);
    const revealX = THREE.MathUtils.lerp(approachX, 2.05, reveal);
    const revealZ = THREE.MathUtils.lerp(approachZ, -1.95, reveal);

    camera.position.set(
      THREE.MathUtils.lerp(revealX, 0.22, seatedReveal) + sway,
      THREE.MathUtils.lerp(1.68 + bob - footfall, 1.31, seatedReveal),
      THREE.MathUtils.lerp(revealZ, -2.84, seatedReveal),
    );
    lookTarget.set(
      THREE.MathUtils.lerp(-0.18, 0.72, focus) + sway * 0.8,
      THREE.MathUtils.lerp(1.32, 1.51, focus),
      THREE.MathUtils.lerp(-4.3, -5.66, focus),
    );
    camera.lookAt(lookTarget);
    camera.rotateZ(sway * 0.18);
    invalidate();
  }, [camera, invalidate, lookTarget, progress]);

  return null;
}

function Box({
  position,
  scale,
  rotation = [0, 0, 0],
  material = materials.plastic,
  castShadow = true,
}: {
  position: Vector3Tuple;
  scale: Vector3Tuple;
  rotation?: Vector3Tuple;
  material?: THREE.Material;
  castShadow?: boolean;
}) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow={castShadow} receiveShadow material={material}>
      <boxGeometry />
    </mesh>
  );
}

function Dust() {
  const positions = useMemo(() => {
    const data = new Float32Array(78 * 3);
    for (let index = 0; index < 78; index += 1) {
      data[index * 3] = -4.8 + Math.random() * 9.6;
      data[index * 3 + 1] = 0.2 + Math.random() * 4.8;
      data[index * 3 + 2] = -7 + Math.random() * 14;
    }
    return data;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffd6a0" size={0.018} transparent opacity={0.42} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function WindowAndSun() {
  return (
    <group>
      <group position={[-5.36, 2.75, -1.15]} rotation={[0, Math.PI / 2, 0]}>
        <Box position={[0, 0, 0]} scale={[3.7, 3.25, 0.08]} material={materials.metal} castShadow={false} />
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[3.45, 2.95]} />
          <meshBasicMaterial color="#f4b878" transparent opacity={0.44} />
        </mesh>
        <Box position={[0, 0, 0.09]} scale={[0.06, 3.1, 0.08]} material={materials.metal} />
        <Box position={[0, 0, 0.09]} scale={[3.55, 0.08, 0.06]} material={materials.metal} />
      </group>
      {[-0.9, 0.05, 1].map((offset) => (
        <mesh key={offset} position={[-2.35, 2.2, -1.15 + offset]} rotation={[0, 0, Math.PI / 2.42]}>
          <coneGeometry args={[0.72, 6.2, 4, 1, true]} />
          <meshBasicMaterial color="#ffbd78" transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function WallSheet({
  position,
  rotation,
  variant,
  tilt = 0,
}: {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  variant: "math" | "lab" | "integration" | "tracking";
  tilt?: number;
}) {
  return (
    <group position={position} rotation={[rotation[0], rotation[1], rotation[2] + tilt]}>
      <Box position={[0, 0, 0]} scale={[1.54, 1.02, 0.045]} material={materials.wood} />
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[1.42, 0.9]} />
        <meshStandardMaterial color="#d8d1bd" roughness={0.86} />
      </mesh>
      <Html transform position={[0, 0, 0.058]} distanceFactor={1.2}>
        <div className={`wall-sheet ${variant}`} aria-hidden="true">
          {variant === "math" && (
            <>
              <i>x(t) = A cos(ωt + φ)</i><i>∫ f(x)dx</i><span className="curve" /><b>Σ</b><small>λ₁ · v₁ = A · v₁</small>
            </>
          )}
          {variant === "lab" && (
            <>
              <span className="flow node-a" /><span className="flow node-b" /><span className="flow node-c" />
              <span className="flow-line one" /><span className="flow-line two" />
              <i>sample → result</i><small>review / approve / release</small>
            </>
          )}
          {variant === "integration" && (
            <>
              <span className="system one">LIMS</span><span className="system two">API</span><span className="system three">DB</span>
              <span className="connector horizontal" /><span className="connector vertical" /><i>{"{ event_id, status }"}</i>
            </>
          )}
          {variant === "tracking" && (
            <>
              <span className="map-road road-a" /><span className="map-road road-b" /><span className="map-road road-c" />
              <span className="map-pin pin-a" /><span className="map-pin pin-b" /><i>-26.2041, 28.0473</i>
            </>
          )}
        </div>
      </Html>
    </group>
  );
}

function CareerWall() {
  return (
    <group>
      <WallSheet position={[-5.34, 2.25, 2.6]} rotation={[0, Math.PI / 2, 0]} variant="math" tilt={-0.03} />
      <WallSheet position={[5.34, 2.18, 0.45]} rotation={[0, -Math.PI / 2, 0]} variant="lab" tilt={0.02} />
      <WallSheet position={[-5.34, 2.36, -2.55]} rotation={[0, Math.PI / 2, 0]} variant="integration" tilt={0.018} />
      <WallSheet position={[3.35, 3.52, -8.32]} rotation={[0, 0, 0]} variant="tracking" tilt={-0.02} />
    </group>
  );
}

function ReferenceStorage() {
  return (
    <group>
      <group position={[-4.25, 0, -4.85]}>
        <Box position={[0, 1.35, 0]} scale={[1.3, 2.7, 1.1]} material={materials.metal} />
        <mesh position={[0, 1.35, 0.57]}>
          <planeGeometry args={[1.12, 2.45]} />
          <meshStandardMaterial color="#b7bab8" roughness={0.38} metalness={0.62} />
        </mesh>
        <Box position={[0, 1.27, 0.59]} scale={[1.04, 0.035, 0.035]} material={materials.metal} />
        <Box position={[0, 0.22, 0.59]} scale={[0.72, 0.06, 0.04]} material={materials.metal} />
      </group>

      <group position={[-2.95, 0, -4.78]}>
        {[-0.62, 0.62].map((x) => <Box key={x} position={[x, 1.58, 0]} scale={[0.07, 3.16, 0.72]} material={materials.metal} />)}
        {[0.14, 0.78, 1.42, 2.06, 2.7].map((height) => <Box key={height} position={[0, height, 0]} scale={[1.38, 0.075, 0.72]} material={materials.wood} />)}
        <Cable points={[[-0.62, 0.2, -0.35], [0.62, 1.15, -0.35], [-0.62, 2.12, -0.35]]} radius={0.018} />
        <Cable points={[[0.62, 0.2, -0.35], [-0.62, 1.15, -0.35], [0.62, 2.12, -0.35]]} radius={0.018} />
        <Box position={[0.1, 2.83, 0.02]} scale={[0.76, 0.28, 0.48]} material={materials.paper} />
        <Box position={[-0.18, 2.92, 0.02]} scale={[0.62, 0.14, 0.42]} material={materials.paper} />
        <group position={[0.12, 1.51, 0.05]} rotation={[0, 0.08, 0]}>
          <Box position={[0, 0, 0]} scale={[0.72, 0.1, 0.45]} material={materials.paper} />
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
            <meshStandardMaterial color="#e7e7e3" roughness={0.46} />
          </mesh>
        </group>
        <group position={[0.18, 0.88, 0.06]}>
          <Box position={[0, 0, 0]} scale={[0.72, 0.24, 0.48]} material={materials.fabric} />
          <Box position={[0.12, 0.22, 0]} scale={[0.58, 0.12, 0.42]} material={materials.fabric} />
        </group>
        <group position={[-0.12, 0.3, 0.06]}>
          <mesh><cylinderGeometry args={[0.32, 0.28, 0.52, 16]} /><primitive object={materials.fabric} attach="material" /></mesh>
          <Box position={[0.1, 0.22, 0]} scale={[0.45, 0.14, 0.34]} material={materials.paper} />
        </group>
      </group>
    </group>
  );
}

function LaptopKeyboard() {
  const keys = useRef<THREE.InstancedMesh>(null);
  const keyGeometry = useMemo(() => new THREE.BoxGeometry(0.052, 0.012, 0.052), []);
  const keyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#171a1b", roughness: 0.62 }), []);

  useLayoutEffect(() => {
    if (!keys.current) return;
    const matrix = new THREE.Matrix4();
    let index = 0;
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 13; column += 1) {
        matrix.makeTranslation(-0.34 + column * 0.057, 0.018, -0.1 + row * 0.057);
        keys.current.setMatrixAt(index, matrix);
        index += 1;
      }
    }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      <instancedMesh ref={keys} args={[keyGeometry, keyMaterial, 52]} castShadow />
    </group>
  );
}

function Laptop() {
  return (
    <group position={[-0.1, 0.94, -4.72]} rotation={[0, -0.02, 0]}>
      <group rotation={[-0.025, 0, 0]}>
        <Box position={[0, 0, 0]} scale={[0.92, 0.045, 0.58]} material={materials.metal} />
        <group position={[0, 0.052, 0.02]}>
          <LaptopKeyboard />
          <Box position={[0, 0.018, 0.19]} scale={[0.28, 0.008, 0.14]} material={materials.plastic} />
        </group>
      </group>
      <mesh position={[0, 0.08, -0.49]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.76, 12]} />
        <primitive object={materials.metal} attach="material" />
      </mesh>
      <group position={[0, 0.4, -0.51]} rotation={[-0.24, 0, 0]}>
        <Box position={[0, 0, 0]} scale={[0.92, 0.66, 0.035]} material={materials.metal} />
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.82, 0.61]} />
          <meshStandardMaterial color="#071218" emissive="#19384b" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
        <Html transform position={[0, 0, 0.045]} distanceFactor={1.08}>
          <div className="laptop-code" aria-hidden="true">
            <small>workspace / integration-service</small>
            <i>const pipeline = await connect()</i>
            <i>validate(sample.result)</i>
            <i>publish("approved")</i>
          </div>
        </Html>
      </group>
    </group>
  );
}

function Tablet() {
  return (
    <group position={[-1.22, 1.05, -4.62]} rotation={[-0.25, 0.08, 0]}>
      <Box position={[0, -0.2, 0.22]} scale={[0.72, 0.08, 0.52]} rotation={[0.28, 0, 0]} material={materials.plastic} />
      <Box position={[0, 0, 0]} scale={[0.7, 0.88, 0.04]} material={materials.plastic} />
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[0.62, 0.79]} />
        <meshStandardMaterial color="#141719" roughness={0.34} metalness={0.18} />
      </mesh>
    </group>
  );
}

function DeskClutter() {
  return (
    <group>
      <Laptop />
      <Tablet />
      <group position={[1.18, 0.94, -4.2]} rotation={[0, -0.12, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.13, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#e7e5df" roughness={0.42} />
        </mesh>
      </group>
      <group position={[2.18, 1.13, -4.62]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.54, 20]} />
          <meshStandardMaterial color="#c8ced0" roughness={0.26} metalness={0.64} />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.04, 20]} />
          <meshStandardMaterial color="#222629" roughness={0.3} metalness={0.42} />
        </mesh>
      </group>
      <Box position={[-1.92, 0.93, -4.58]} scale={[0.3, 0.035, 0.18]} rotation={[0, 0.18, 0]} material={materials.metal} />
      <mesh position={[-1.76, 0.99, -4.5]} rotation={[Math.PI / 2, 0, 0.5]}>
        <torusGeometry args={[0.08, 0.012, 6, 18]} />
        <meshStandardMaterial color="#b0b6b7" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  );
}

function Screen({
  position,
  rotation = [0, 0, 0],
  scale,
  variant,
  intensity,
}: {
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale: Vector3Tuple;
  variant: "sql" | "flow" | "map" | "boot";
  intensity: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 0, 0]} scale={scale} material={materials.plastic} />
      <mesh position={[0, 0, scale[2] + 0.012]}>
        <planeGeometry args={[scale[0] * 0.91, scale[1] * 0.86]} />
        <meshStandardMaterial color="#071218" emissive={variant === "map" ? "#145149" : "#0d4d5b"} emissiveIntensity={intensity} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, scale[2] + 0.02]} material={glassMaterial}>
        <planeGeometry args={[scale[0] * 0.92, scale[1] * 0.87]} />
      </mesh>
      <Html transform position={[0, 0, scale[2] + 0.028]} distanceFactor={1.22}>
        <div className={`work-screen ${variant}`} style={{ opacity: Math.max(0.16, intensity / 2.4) }}>
          {variant === "sql" && <><small>query.sql</small><b>SELECT sample_id, status</b><i>FROM results</i><i>WHERE approved = 1;</i><span className="query-chart" /></>}
          {variant === "flow" && <><small>integration.flow</small><span className="screen-node a">LIMS</span><span className="screen-node b">API</span><span className="screen-node c">ERP</span><span className="screen-link one" /><span className="screen-link two" /></>}
          {variant === "map" && <><small>fleet.live</small><span className="screen-road one" /><span className="screen-road two" /><span className="screen-road three" /><span className="screen-vehicle one" /><span className="screen-vehicle two" /></>}
          {variant === "boot" && <><span className="monitor-orbit" /><strong>MLO.OS</strong><small>{intensity > 1.5 ? "IDENTITY KERNEL READY" : "INITIALIZING..."}</small></>}
        </div>
      </Html>
    </group>
  );
}

function Cable({ points, radius = 0.012 }: { points: Vector3Tuple[]; radius?: number }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return new THREE.TubeGeometry(curve, 24, radius, 6, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color="#090a0b" roughness={0.72} />
    </mesh>
  );
}

function DeskInfrastructure() {
  return (
    <group>
      {[-2.35, 2.35].map((x) => (
        <group key={x}>
          <Box position={[x, 0.42, -4.65]} scale={[0.08, 0.84, 1.08]} material={materials.metal} />
          <Box position={[x, 0.42, -5.02]} scale={[0.08, 0.84, 0.08]} material={materials.metal} />
        </group>
      ))}
      <group position={[2.65, 0, -4.85]}>
        {[0.12, 0.54].map((height) => <Box key={height} position={[0, height, 0]} scale={[1.2, 0.07, 0.9]} material={materials.wood} />)}
        {[-0.52, 0.52].map((x) => <Box key={x} position={[x, 0.38, 0]} scale={[0.07, 0.76, 0.9]} material={materials.metal} />)}
        <Box position={[-0.25, 0.2, 0.03]} scale={[0.4, 0.14, 0.48]} material={materials.paper} />
        <Box position={[0.28, 0.62, 0]} scale={[0.42, 0.12, 0.52]} material={materials.fabric} />
        <Box position={[0.38, 0.78, 0.02]} scale={[0.34, 0.08, 0.42]} material={materials.paper} />
      </group>
      <Cable points={[[1.3, 1.1, -5.54], [1.35, 0.78, -5.58], [1.15, 0.08, -5.25], [1.4, 0.04, -3.9]]} radius={0.015} />
      <Cable points={[[0.2, 1.0, -4.9], [0.1, 0.7, -5.18], [-0.15, 0.05, -5.05], [0.15, 0.03, -3.9]]} radius={0.012} />
      <Cable points={[[1.85, 0.08, -4.9], [2.45, 0.04, -4.2], [2.8, 0.03, -3.7]]} radius={0.012} />
    </group>
  );
}

function Workstation() {
  const progress = useExperienceStore((state) => state.progress);
  const screenOn = THREE.MathUtils.smoothstep(progress, 0.7, 0.9);

  return (
    <group>
      <Box position={[0.1, 0.82, -4.82]} scale={[5.05, 0.12, 1.45]} material={materials.wood} />
      <Box position={[0.45, 0.91, -4.5]} scale={[3.65, 0.025, 0.78]} material={materials.fabric} />
      <Screen position={[1.35, 1.63, -5.52]} scale={[1.72, 1.05, 0.09]} variant="boot" intensity={screenOn * 2.6} />
      <Box position={[1.35, 1.03, -5.52]} scale={[0.08, 0.46, 0.07]} material={materials.metal} />
      <Box position={[1.35, 0.88, -5.25]} scale={[0.62, 0.035, 0.28]} material={materials.metal} />
      <DeskInfrastructure />
      <DeskClutter />
      <pointLight position={[1.35, 1.62, -5.05]} color="#76d8ff" intensity={screenOn * 2.2} distance={3.2} />
    </group>
  );
}

function ServerRack() {
  return (
    <group position={[4.35, 0, -7.2]} rotation={[0, -0.06, 0]}>
      <Box position={[0, 1.18, 0]} scale={[1.05, 2.36, 0.95]} material={materials.metal} />
      {Array.from({ length: 7 }).map((_, index) => (
        <group key={index} position={[0, 0.42 + index * 0.24, 0.49]}>
          <Box position={[0, 0, 0]} scale={[0.86, 0.14, 0.04]} material={materials.plastic} />
          <mesh position={[0.31, 0, 0.03]}><sphereGeometry args={[0.018, 8, 8]} /><meshBasicMaterial color={index % 3 === 0 ? "#e0a25a" : "#69b9a7"} /></mesh>
        </group>
      ))}
      <pointLight position={[0, 1.2, 0.9]} color="#64bba8" intensity={0.65} distance={2.2} />
    </group>
  );
}

function ChairAndFloorLife() {
  return (
    <group>
      <group position={[0.22, 0, -2.85]} rotation={[0, -0.12, 0]}>
        <mesh position={[0, 0.56, 0]} scale={[0.82, 0.18, 0.82]} castShadow receiveShadow>
          <cylinderGeometry args={[0.52, 0.46, 0.34, 24]} />
          <primitive object={materials.fabric} attach="material" />
        </mesh>
        <group position={[0, 1.12, 0.3]} rotation={[-0.08, 0, 0]}>
          <mesh scale={[0.78, 0.9, 0.12]} castShadow receiveShadow>
            <capsuleGeometry args={[0.48, 0.62, 8, 20]} />
            <primitive object={materials.fabric} attach="material" />
          </mesh>
          {[-0.22, 0, 0.22].map((x) => (
            <mesh key={x} position={[x, 0, -0.13]} scale={[0.045, 0.68, 0.045]}>
              <capsuleGeometry args={[0.5, 0.6, 4, 8]} />
              <primitive object={materials.metal} attach="material" />
            </mesh>
          ))}
        </group>
        <Box position={[-0.55, 0.73, 0.02]} scale={[0.12, 0.08, 0.62]} material={materials.metal} />
        <Box position={[0.55, 0.73, 0.02]} scale={[0.12, 0.08, 0.62]} material={materials.metal} />
        <Box position={[-0.55, 0.52, 0.15]} scale={[0.06, 0.42, 0.06]} material={materials.metal} />
        <Box position={[0.55, 0.52, 0.15]} scale={[0.06, 0.42, 0.06]} material={materials.metal} />
        <Box position={[0, 0.25, 0]} scale={[0.12, 0.56, 0.12]} material={materials.metal} />
        {[0, 1.25, 2.5, 3.75, 5].map((angle) => (
          <group key={angle}>
            <Box position={[Math.sin(angle) * 0.38, 0.08, Math.cos(angle) * 0.38]} scale={[0.5, 0.06, 0.08]} rotation={[0, angle, 0]} material={materials.metal} />
            <mesh position={[Math.sin(angle) * 0.66, 0.07, Math.cos(angle) * 0.66]} rotation={[Math.PI / 2, angle, 0]} castShadow>
              <cylinderGeometry args={[0.075, 0.075, 0.065, 12]} />
              <primitive object={materials.plastic} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[0.1, 0.025, -3.2]} rotation={[-Math.PI / 2, 0, -0.04]} receiveShadow>
        <planeGeometry args={[4.4, 3.4]} />
        <meshStandardMaterial color="#342b24" roughness={0.94} />
      </mesh>
      <group position={[-2.55, 0.34, -2.72]} rotation={[0, 0.28, -0.08]}>
        <Box position={[0, 0, 0]} scale={[0.72, 0.62, 0.3]} material={materials.fabric} />
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.04, 8, 18, Math.PI]} /><primitive object={materials.fabric} attach="material" /></mesh>
      </group>
      <Box position={[2.6, 0.06, -3.8]} scale={[0.72, 0.12, 0.28]} rotation={[0, -0.18, 0]} material={materials.plastic} />
    </group>
  );
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[11, 18]} /><primitive object={materials.floor} attach="material" /></mesh>
      <Box position={[0, 2.8, -8.5]} scale={[11, 5.6, 0.18]} material={materials.wall} castShadow={false} />
      <Box position={[-5.5, 2.8, 0]} scale={[0.18, 5.6, 17]} material={materials.wall} castShadow={false} />
      <Box position={[5.5, 2.8, 0]} scale={[0.18, 5.6, 17]} material={materials.wall} castShadow={false} />
      <Box position={[0, 5.5, 0]} scale={[11, 0.18, 17]} material={materials.wall} castShadow={false} />
      <Box position={[0, 0.13, -8.3]} scale={[10.7, 0.24, 0.12]} material={materials.wood} castShadow={false} />
      <Box position={[-5.3, 0.13, 0]} scale={[0.12, 0.24, 16.6]} material={materials.wood} castShadow={false} />
      <Box position={[5.3, 0.13, 0]} scale={[0.12, 0.24, 16.6]} material={materials.wood} castShadow={false} />
      <WindowAndSun />
      <CareerWall />
      <ReferenceStorage />
      <ServerRack />
      <Workstation />
      <ChairAndFloorLife />
    </group>
  );
}

export function World({ compact }: { compact: boolean }) {
  return (
    <Canvas
      className="experience-canvas"
      camera={{ fov: compact ? 64 : 52, near: 0.1, far: 45, position: [0.38, 1.68, 7.3] }}
      dpr={compact ? 1 : [1, 1.45]}
      gl={{ antialias: !compact, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
      frameloop="demand"
      shadows={!compact}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.04;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <color attach="background" args={["#38342e"]} />
      <fog attach="fog" args={["#3b3731", 8, 24]} />
      <GoldenHourEnvironment />
      {!compact && <SoftShadows size={18} samples={10} focus={0.42} />}
      <hemisphereLight args={["#e4e6df", "#5c4d40", 0.62]} />
      <directionalLight
        position={[-4.7, 5.8, 2.1]}
        target-position={[0, 0, -4]}
        color="#ffd2a0"
        intensity={4.2}
        castShadow={!compact}
        shadow-mapSize={[compact ? 512 : 1536, compact ? 512 : 1536]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
      />
      <rectAreaLight position={[-3.9, 2.6, -1.1]} rotation={[0, Math.PI / 2, 0]} width={4} height={3} intensity={4.4} color="#f0c391" />
      <rectAreaLight position={[0, 3.9, -5]} rotation={[-Math.PI / 2, 0, 0]} width={5} height={3} intensity={1.25} color="#cdd9d7" />
      <Room />
      {!compact && <ContactShadows position={[0, 0.012, -3.7]} scale={11} opacity={0.38} blur={2.3} far={4.6} resolution={512} frames={1} />}
      <Dust />
      <CameraRig />
    </Canvas>
  );
}
