<template>
  <div class="o-entry">
    <div id="three-container"></div>
    <div class="o-entry__info" ref="info">
      <img
        svg-inline
        src="../../../assets/logo.svg"
        alt="logo"
        class="o-entry__logo"
      />
      <img
        svg-inline
        src="../../../assets/logoEn.svg"
        alt="logo"
        class="o-entry__logo-en"
      />
      <aCircleButton
        type="start"
        class="o-entry__button"
        ref="button"
        :onClick="onStartClick"
      />
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import aCircleButton from '@/components/atoms/aCircleButton'
import entry0 from '../../../assets/entry-0.png'
import entry1 from '../../../assets/entry-1.png'

export default {
  mounted() {
    /* eslint-disable */
    function Slide(width, height, animationPhase) {
      var plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2)
      plane = new THREE.Geometry().fromBufferGeometry(plane)
      BAS.Utils.separateFaces(plane)
      var geometry = new BAS.ModelBufferGeometry(plane, {
        localizeFaces: true,
        computeCentroids: true,
      })
      geometry.bufferUvs()
      var i, j, offset, centroid
      var aDelayDuration = geometry.createAttribute('aDelayDuration', 2)
      var minDuration = 0.8
      var maxDuration = 1.2
      var maxDelayX = 0.9
      var maxDelayY = 0.125
      var stretch = 0.11
      this.totalDuration = maxDuration + maxDelayX + maxDelayY + stretch
      for (i = 0, offset = 0; i < geometry.faceCount; i++) {
        centroid = geometry.centroids[i]
        var duration = THREE.MathUtils.randFloat(minDuration, maxDuration)
        var delayX = THREE.MathUtils.mapLinear(
          centroid.x,
          -width * 0.5,
          width * 0.5,
          0,
          maxDelayX
        )
        var delayY
        if (animationPhase === 'in') {
          delayY = THREE.MathUtils.mapLinear(
            Math.abs(centroid.y),
            0,
            height * 0.5,
            0,
            maxDelayY
          )
        } else {
          delayY = THREE.MathUtils.mapLinear(
            Math.abs(centroid.y),
            0,
            height * 0.5,
            maxDelayY,
            0
          )
        }
        for (j = 0; j < 3; j++) {
          aDelayDuration.array[offset] =
            delayX + delayY + Math.random() * stretch * duration
          aDelayDuration.array[offset + 1] = duration
          offset += 2
        }
      }
      var aStartPosition = geometry.createAttribute(
        'aStartPosition',
        3,
        function (data, i) {
          geometry.centroids[i].toArray(data)
        }
      )
      var aEndPosition = geometry.createAttribute(
        'aEndPosition',
        3,
        function (data, i) {
          geometry.centroids[i].toArray(data)
        }
      )
      var aControl0 = geometry.createAttribute('aControl0', 3)
      var aControl1 = geometry.createAttribute('aControl1', 3)
      var control0 = new THREE.Vector3()
      var control1 = new THREE.Vector3()
      var data = []
      for (i = 0, offset = 0; i < geometry.faceCount; i++) {
        centroid = geometry.centroids[i]
        var signY = Math.sign(centroid.y)
        control0.x = THREE.MathUtils.randFloat(0.1, 0.3) * 50
        control0.y = signY * THREE.MathUtils.randFloat(0.1, 0.3) * 70
        control0.z = THREE.MathUtils.randFloatSpread(20)
        control1.x = THREE.MathUtils.randFloat(0.3, 0.6) * 50
        control1.y = -signY * THREE.MathUtils.randFloat(0.3, 0.6) * 70
        control1.z = THREE.MathUtils.randFloatSpread(20)
        if (animationPhase === 'in') {
          control0.subVectors(centroid, control0)
          control1.subVectors(centroid, control1)
        } else {
          control0.addVectors(centroid, control0)
          control1.addVectors(centroid, control1)
        }
        geometry.setFaceData(aControl0, i, control0.toArray(data))
        geometry.setFaceData(aControl1, i, control1.toArray(data))
      }
      var texture = new THREE.Texture()
      texture.minFilter = THREE.NearestFilter
      var material = new BAS.BasicAnimationMaterial({
        flatShading: true,
        side: THREE.DoubleSide,
        map: texture,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexFunctions: [
          BAS.ShaderChunk['cubic_bezier'],
          BAS.ShaderChunk['ease_cubic_in_out'],
          BAS.ShaderChunk['quaternion_rotation'],
        ],
        vertexParameters: [
          'uniform float uTime;',
          'attribute vec2 aDelayDuration;',
          'attribute vec3 aStartPosition;',
          'attribute vec3 aControl0;',
          'attribute vec3 aControl1;',
          'attribute vec3 aEndPosition;',
        ],
        vertexInit: [
          'float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
        ],
        vertexPosition: [
          // this scales each face
          // for the in animation, we want to go from 0.0 to 1.0
          // for the out animation, we want to go from 1.0 to 0.0
          animationPhase === 'in'
            ? 'transformed *= tProgress;'
            : 'transformed *= 1.0 - tProgress;',
          // translation based on the bezier curve defined by the attributes
          'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);',
        ],
      })
      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.frustumCulled = false
    }
    Object.defineProperty(Slide.prototype, 'time', {
      get: function () {
        return this.mesh.material.uniforms['uTime'].value
      },
      set: function (v) {
        this.mesh.material.uniforms['uTime'].value = v
      },
    })
    Slide.prototype.setImage = function (image) {
      this.mesh.material.uniforms.map.value.image = image
      this.mesh.material.uniforms.map.value.needsUpdate = true
    }
    Slide.prototype.transition = function () {
      return gsap.fromTo(
        this,
        {
          time: 0,
        },
        {
          time: this.totalDuration,
          ease: Power0.easeInOut,
          duration: 3,
        }
      )
    }
    //-------
    var root = new THREERoot({
      fov: 80,
      createCameraControls: false,
    })
    root.renderer.setClearColor(0)
    root.camera.position.set(0, 0, 40)
    var light = new THREE.DirectionalLight()
    light.position.set(0, 0, 1)
    root.scene.add(light)
    // width and height for the THREE.PlaneGeometry that will be used for the two slides
    var width = window.innerWidth / 10
    var height = window.innerHeight / 10
    // slide 1 will be the transition out slide
    var slide = new Slide(width, height, 'out')
    root.scene.add(slide.mesh)
    new THREE.ImageLoader().load(entry1, function (image) {
      slide.setImage(image)
    })
    // slide 2 will be the transition in slide
    var slide2 = new Slide(width, height, 'in')
    root.scene.add(slide2.mesh)
    new THREE.ImageLoader().load(entry0, function (image) {
      slide2.setImage(image)
    })
    gsap
      .timeline({})
      .fromTo(
        this.$refs.info,
        {
          opacity: 0,
        },
        {
          duration: 4,
          opacity: 1,
        }
      )
      .to(this.$refs.info, {
        delay: 1.5,
        duration: 0.5,
        opacity: 0,
      })
      .add(slide.transition(), '-=0.4')
      .add(slide2.transition(), '<')
      .to(this.$refs.info, {
        duration: 0.5,
        opacity: 1,
        justifyContent: 'flex-start',
        onStart: () => {
          gsap.set(this.$refs.button.$el, {
            display: 'block',
          })
        },
      })
  },
  components: { aCircleButton },
  props: ['onStartClick'],
}
</script>
<style lang="scss" scoped>
.o-entry {
  position: relative;

  &__info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }

  &__logo {
    margin-top: 70px;
    margin-bottom: 30px;

    &-en {
      margin-bottom: 70px;
    }
  }

  &__button {
    display: none;
    margin-bottom: 30px;
  }
}
</style>
