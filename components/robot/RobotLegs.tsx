"use client";

const BODY_COLOR = "#1a1a2e";
const JOINT_COLOR = "#252540";

const RobotLegs = () => {
  return (
    <group position={[0, -1.0, 0]}>
      {[{ x: -0.2 }, { x: 0.2 }].map(({ x }, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.07, 0.065, 0.5, 12]} />
            <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
          </mesh>
          <group position={[0, -0.6, 0]}>
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.065, 0.06, 0.4, 12]} />
              <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.55, 0.04]}>
              <boxGeometry args={[0.16, 0.08, 0.22]} />
              <meshStandardMaterial color={BODY_COLOR} metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export { RobotLegs };
