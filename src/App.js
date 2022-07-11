import * as THREE from 'three'
import { Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Text, CubeCamera, useBoxProjectedEnv } from '@react-three/drei'
import { LayerMaterial, Depth, Noise } from 'lamina'
import FloatingObjects from './FloatingObjects'

export default function App() {
  return (
      <>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 22 }}>
          <Bg />
          <Suspense fallback={null}>
            <FloatingObjects />
            <Caption>{`BLAKE HATCH\nBUILDER.\nDEVELOPER.`}</Caption>
            <Rig />
          </Suspense>

            {/*<Bg />*/}
            {/*<Suspense fallback={null}>*/}
            {/*    <FloatingObjects />*/}
            {/*    <Caption>{`BLAKE HATCH\nBUILDER.\nDEVELOPER.`}</Caption>*/}
            {/*    <Rig />*/}
            {/*</Suspense>*/}
        </Canvas>

          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 22 }}>

              <Bg />
              <Suspense fallback={null}>
                  <FloatingObjects glb={'/ether_scene_no_box.glb'}/>
                  <TextPlane>{`Hello world.`}</TextPlane>
                  <Rig />
              </Suspense>
          </Canvas>
      </>
  )
}

function Caption( { children } ) {
  const { width } = useThree((state) => state.viewport)

        return (
            <Text
                    position={[0, 0, -5]}
                    lineHeight={0.8}
                    font="/Ki-Medium.ttf"
                    fontSize={width / 8}
                    material-toneMapped={false}
                    anchorX="center"
                    anchorY="middle">
                    {children}
                </Text>
        );
}

function TextPlane( { children } ) {
    const projection = useBoxProjectedEnv(
        [0, 0, 0], // Position
        [1, 1, 1] // Scale
    );
    const { width } = useThree((state) => state.viewport)

    return (
        <>
            <Text
                position={[0, 0, 0.1]}
                lineHeight={0.8}
                font="/Ki-Medium.ttf"
                fontSize={width / 25}
                material-toneMapped={false}
                anchorX="center"
                anchorY="middle">
                {children}
            </Text>
            <CubeCamera frames={1}>
                {(texture) => (
                    <mesh>
                        <planeGeometry/>
                        <meshStandardMaterial envMap={texture} {...projection} />
                    </mesh>
                )}
            </CubeCamera>
        </>
    );
}

function Rig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    state.camera.position.lerp(v.set(state.mouse.x / 2, state.mouse.y / 2, 10), 0.05)
  })
}

function Bg() {
  return (
    <mesh scale={100}>
      <boxGeometry args={[1, 1, 1]} />
      <LayerMaterial side={THREE.BackSide}>
        <Depth colorB="red" colorA="skyblue" alpha={1} mode="normal" near={130} far={200} origin={[100, 100, -100]} />
        <Noise mapping="local" type="white" scale={1000} colorA="white" colorB="black" mode="subtract" alpha={0.2} />
      </LayerMaterial>
    </mesh>
  )
}
