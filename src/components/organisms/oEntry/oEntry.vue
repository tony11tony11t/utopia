<template>
  <div class="o-entry">
    <div id="three-container"></div>
    <aLoadingAnimation ref="loading" :disableBackDrop="true" />
    <div class="o-entry__info" ref="info">
      <img
        svg-inline
        src="../../../assets/logo.svg"
        alt="logo"
        class="o-entry__logo"
        ref="logo"
      />
      <div class="o-entry__bottom">
        <img
          svg-inline
          ref="start"
          class="o-entry__start-button-icon"
          src="../../../assets/icons/send.svg"
          alt="start"
          @click="handleStartClick"
          @keydown="handleStartClick"
        />
        <img
          svg-inline
          src="../../../assets/logoEn.svg"
          alt="logo"
          class="o-entry__logo-en"
          ref="logo-en"
        />
      </div>
    </div>
  </div>
</template>
<script>
import gsap from 'gsap'
import aCircleButton from '@/components/atoms/aCircleButton'
import aLoadingAnimation from '@/components/atoms/aLoadingAnimation'
import entry0 from '../../../assets/entry-0.png'
import entry1 from '../../../assets/entry-1.png'

export default {
  data() {
    return {
      clickEvent: null,
    }
  },
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
      fov: 60,
      createCameraControls: false,
    })
    root.renderer.setClearColor(0)
    root.camera.position.set(0, -50, 40)
    var light = new THREE.DirectionalLight()
    light.position.set(0, 0, 1)
    root.scene.add(light)
    // width and height for the THREE.PlaneGeometry that will be used for the two slides
    var width = (window.innerWidth / window.innerHeight) * 100
    var height = 100
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

    this.musicList.alien.stop()
    this.musicList.alien.play()

    //start animation
    let camera = {
      y: -50,
      z: 20,
    }

    //clickevent
    this.clickEvent = () => {
      gsap
        .timeline({
          onStart: () => {
            document.body.removeEventListener('click', this.clickEvent)
          },
        })
        .to(this.$refs.loading.$el, {
          opacity: 0,
          pointerEvents: 'none',
        })
        .add(slide.transition(), '-=0.4')
        .add(slide2.transition(), '<')
        .to(this.$refs.start, {
          opacity: 1,
          duration: 1,
          pointerEvents: 'auto',
        })
    }

    gsap
      .timeline({
        onComplete: () => {
          document.body.addEventListener('click', this.clickEvent)
        },
      })
      .to(camera, {
        y: 0,
        z: 60,
        duration: 5,
        onUpdate: () => {
          root.camera.position.set(0, camera.y, camera.z)
        },
      })
      .from(
        this.$refs.logo,
        {
          y: -150,
          duration: 2,
        },
        '-=4'
      )
      .from(
        this.$refs['logo-en'],
        {
          y: 100,
          duration: 2,
        },
        '<'
      )
      .fromTo(
        this.$refs.loading.$el,
        {
          opacity: 0,
        },
        {
          duration: 0.5,
          opacity: 1,
        },
        '-=3'
      )
  },
  components: { aCircleButton, aLoadingAnimation },
  props: ['onStartClick', 'musicList'],
  methods: {
    handleStartClick() {
      gsap
        .timeline({
          onStart: () => {
            this.musicList.leafshort.play()
            this.musicList.alien.once('fade', () => {
              this.musicList.alien.stop()
            })
            this.musicList.alien.fade(1, 0, 2000)
          },
          onComplete: () => {
            this.onStartClick()
          },
        })
        .to(this.$refs.logo, {
          y: -150,
          duration: 2,
        })
        .to(
          this.$refs['logo-en'],
          {
            y: 100,
            duration: 2,
          },
          '<'
        )
        .to(
          this.$refs.start,
          {
            opacity: 0,
            duration: 2,
          },
          '<'
        )
    },
  },
}
</script>
<style lang="scss" scoped>
.o-entry {
  position: absolute;
  opacity: 1;

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

  &__bottom {
    gap: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__start {
    &-button {
      &-icon {
        opacity: 0;
        pointer-events: none;
        padding: 15px;
        border-radius: 30%;
        width: 20px;
        height: 20px;
        box-sizing: content-box;
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.01),
            rgba(0, 0, 0, 0.01)
          ),
          radial-gradient(
            85.85% 88.54% at 50% 50%,
            rgba(255, 255, 255, 0.045) 44.43%,
            rgba(255, 255, 255, 0.216) 100%
          );
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25),
          inset 0 1px 2px rgba(255, 255, 255, 0.25);

        &:active {
          background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.01),
              rgba(0, 0, 0, 0.01)
            ),
            radial-gradient(
              54.66% 121.43% at 50% 50%,
              rgba(255, 255, 255, 0.02) 69.79%,
              rgba(255, 255, 255, 0.096) 100%
            );
          box-shadow: inset 0 3px 3px rgba(0, 0, 0, 0.4),
            inset 0 -2px 2px rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
}
</style>
