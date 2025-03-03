import * as THREE from 'three'
import startPointVertexShader from './shader/startPoint/vertex.glsl'
import startPointFragmentShader from './shader/startPoint/fragment.glsl'
import fireworkVertexShader from './shader/firework/vertex.glsl'
import fireworkFragmentShader from './shader/firework/fragment.glsl'

export default class Firework {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    this.color = new THREE.Color(color)
    //创建烟花发射的球点
    this.startGeometry = new THREE.BufferGeometry()
    const startPositionBuffer = new Float32Array(3)
    startPositionBuffer[0] = from.x
    startPositionBuffer[1] = from.y
    startPositionBuffer[2] = from.z
    const astepArray = new Float32Array(3)
    astepArray[0] = to.x - from.x
    astepArray[1] = to.y - from.y
    astepArray[2] = to.z - from.x
    this.startGeometry.setAttribute('aStep', new THREE.BufferAttribute(astepArray, 3))
    this.startGeometry.setAttribute('position', new THREE.BufferAttribute(startPositionBuffer, 3))
    //设置着色器材质
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertexShader,
      fragmentShader: startPointFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,

      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20.0,
        },
        uColor: { value: this.color },
      },
    })
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial)

    const aStepArray = new Float32Array(3)
    aStepArray[0] = to.x - from.x
    aStepArray[1] = to.y - from.y
    aStepArray[2] = to.z - from.z
    this.startGeometry.setAttribute('aStep', new THREE.BufferAttribute(aStepArray, 3))

    //计时
    this.clock = new THREE.Clock()

    //创建爆炸的烟花
    this.fireworkGeometry = new THREE.BufferGeometry()
    this.fireworkCount = 180 + Math.floor(Math.random() * 180)
    const positionFireworkArray = new Float32Array(this.fireworkCount * 3)
    const scaleFireArray = new Float32Array(this.fireworkCount)
    const directionArray = new Float32Array(this.fireworkCount * 3)
    for (let i = 0; i < this.fireworkCount; i++) {
      //一开始烟花的位置
      positionFireworkArray[i * 3 + 0] = to.x
      positionFireworkArray[i * 3 + 1] = to.y
      positionFireworkArray[i * 3 + 2] = to.z
      //烟花的尺寸
      scaleFireArray[i] = Math.random()
      // 设置四周发射的角度
      let theta = Math.random() * 2 * Math.PI
      let beta = Math.random() * 2 * Math.PI
      let r = Math.random()
      // directionArray[i * 3 + 0] = r * Math.cos(theta) + r * Math.cos(beta)
      // directionArray[i * 3 + 1] = r * Math.sin(beta) + r * Math.sin(theta)
      // directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta)
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta)
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
    }

    this.fireworkGeometry.setAttribute('position', new THREE.BufferAttribute(positionFireworkArray, 3))
    this.fireworkGeometry.setAttribute('direction', new THREE.BufferAttribute(directionArray, 3))
    this.fireworkGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleFireArray, 1))
    this.fireworksMaterial = new THREE.ShaderMaterial({
      vertexShader: fireworkVertexShader,
      fragmentShader: fireworkFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0 },
        uColor: { value: this.color },
      },
    })
    this.firework = new THREE.Points(this.fireworkGeometry, this.fireworksMaterial)
    //创建音频
    this.listener = new THREE.AudioListener()
    this.listener1 = new THREE.AudioListener()
    this.sound = new THREE.Audio(this.listener)
    this.sendSound = new THREE.Audio(this.listener1)
    //创建音频加载器
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load(`./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`, buffer => {
      this.sound.setBuffer(buffer)
      this.sound.setLoop(false)
      this.sound.setVolume(0.5)
    })
    audioLoader.load(`./assets/audio/send.mp3`, buffer => {
      this.sendSound.setBuffer(buffer)
      this.sendSound.setLoop(false)
      this.sendSound.setVolume(0.5)
    })
  }

  addScene(scene, camera) {
    scene.add(this.startPoint)
    scene.add(this.firework)

    this.scene = scene
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime()
    if (elapsedTime < 1 && elapsedTime > 0.2) {
      this.startMaterial.uniforms.uTime.value = elapsedTime

      this.startMaterial.uniforms.uSize.value = 20.0
      if (!this.sendSound.isPlaying && !this.sendSoundPlay) {
        console.log('>>')
        this.sendSound.play()
        this.sendSoundPlay = true
      }
    } else if (elapsedTime > 1) {
      const time = elapsedTime - 1

      this.startPoint.clear()
      this.startGeometry.dispose()
      this.startMaterial.dispose()
      // this.startMaterial.uniforms.uTime.value = elapsedTime
      this.startMaterial.uniforms.uSize.value = 0
      this.fireworksMaterial.uniforms.uSize.value = 20

      this.fireworksMaterial.uniforms.uTime.value = time

      if (!this.sound.isPlaying && !this.play) {
        this.sound.play()
        this.play = true
      }
      if (time > 5) {
        this.fireworksMaterial.uniforms.uSize.value = 0

        this.firework.clear()
        this.fireworkGeometry.dispose()
        this.fireworksMaterial.dispose()
        this.scene.remove(this.firework)
        this.scene.remove(this.startPoint)
        return 'remove'
      }
    }
  }
}
