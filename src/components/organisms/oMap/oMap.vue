<template>
  <div
    class="o-map"
    ref="o-map"
    :class="{
      final: nowMark?.id === 8,
    }"
  >
    <div class="o-map__top">
      <img
        :src="require(`@/assets/mapTop.png`)"
        alt="mapTop"
        class="o-map__top-border"
      />
      <p class="o-map__top-text">{{ nowLatLng }}</p>
      <img
        svg-inline
        src="../../../assets/icons/location.svg"
        class="o-map__top-button-location"
        alt="location"
        @click="handleLocationClick"
        @keydown="handleLocationClick"
      />
      <img
        svg-inline
        src="../../../assets/icons/menus.svg"
        class="o-map__top-button-menus"
        @click="handleMenuClick"
        @keydown="handleMenuClick"
        alt="menus"
      />
      <img
        svg-inline
        src="../../../assets/scale.svg"
        class="o-map__top-scale"
        alt="scale"
      />
    </div>
    <div class="google-map" id="map" ref="map"></div>
    <mMapInfo
      :mark="nowMark"
      :onClick="handleClick"
      class="o-map__info"
      :distance="nowMark ? marksDistance[nowMark?.index] : Infinity"
    />
    <mPhoneCall
      v-if="isPhoneCallShow"
      :contact="nowMark?.contact"
      class="o-map__phone-call"
      ref="phone-call"
      :onClick="handlePhoneCall"
    />
  </div>
</template>
<script>
import gsap from 'gsap'
import FrontendAPI from '@/api'
import mPhoneCall from '@/components/molecules/mPhoneCall'
import aLoadingAnimation from '@/components/atoms/aLoadingAnimation'
import aRingToneAnimation from '@/components/atoms/aRingToneAnimation'
import convertDMS from '../../../utils/convertDMS'
import mMapInfo from '../../molecules/mMapInfo'
import mapMine from '../../../assets/icons/mine.svg'

export default {
  data() {
    return {
      map: null,
      lat: 25.0325917,
      lng: 121.5624999,
      svgMarkerIcon: {
        path: 'M40 33.71C40 36.05 37.83 38.19 33.9 39.73C30.18 41.19 25.24 42 20 42C14.76 42 9.82 41.19 6.1 39.73C2.17 38.18 0 36.04 0 33.71C0 31.38 2.17 29.23 6.1 27.69C7.69 27.07 9.5 26.56 11.46 26.19C11.72 26.63 11.98 27.06 12.24 27.49C10.17 27.85 8.27 28.37 6.62 29.01C3.32 30.31 1.42 32.02 1.42 33.71C1.42 35.4 3.32 37.11 6.62 38.41C10.18 39.81 14.93 40.58 20 40.58C25.07 40.58 29.82 39.81 33.38 38.41C36.68 37.11 38.58 35.4 38.58 33.71C38.58 32.02 36.68 30.31 33.38 29.01C31.73 28.36 29.83 27.85 27.76 27.49C28.02 27.06 28.28 26.63 28.54 26.19C30.5 26.56 32.31 27.07 33.9 27.69C37.83 29.24 40 31.38 40 33.71ZM20 34.46C18.89 34.46 7.96 19.61 7.96 12.02C7.96 5.38 13.35 0 20 0C26.65 0 32.04 5.38 32.04 12.01C32.04 19.6 21.11 34.45 20 34.45V34.46ZM27.23 12.15C26.65 11.85 26.06 11.64 25.45 11.45C24.24 11.1 22.9 10.87 21.51 10.77C21.38 8.72 20.93 6.72 20.13 5.05C19.33 6.71 18.88 8.71 18.75 10.76C16.7 10.89 14.69 11.34 13.03 12.14C14.69 12.94 16.7 13.39 18.76 13.52C18.85 14.91 19.09 16.25 19.44 17.46C19.63 18.07 19.83 18.66 20.14 19.23C20.44 18.66 20.65 18.06 20.84 17.46C21.19 16.25 21.42 14.91 21.52 13.52C22.91 13.43 24.26 13.2 25.47 12.84C26.08 12.65 26.67 12.45 27.25 12.14L27.23 12.15Z',
        fillColor: '#B566FF',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.8,
      },
      allMarks: [],
      marks: [],
      marksDistance: Array.from({ length: 7 }, () => Infinity),
      visible: false,
      nowMark: null,
      isInfoOpen: false,
      isPhoneCallShow: false,
      currentLocation: null,
      isShowLocation: false,
      updatePositionTimer: null,
      locationTimer: null,
    }
  },
  components: {
    mMapInfo,
    mPhoneCall,
  },
  computed: {
    nowLatLng() {
      return this.nowMark
        ? convertDMS(this.nowMark?.position.lat(), this.nowMark?.position.lng())
        : ''
    },
  },
  watch: {
    isPhoneCallShow(nextValue) {
      if (nextValue) {
        this.$nextTick(() => {
          this.sfxList['incoming-phone'].play()
          gsap.to(this.$refs['o-map'], {
            '--blur': '3px',
          })
          gsap.to(this.$refs['phone-call'].$el, {
            opacity: 1,
            pointerEvents: 'auto',
          })
        })
      } else {
        this.$nextTick(() => {
          this.sfxList['incoming-phone'].stop()
          gsap.to(this.$refs['o-map'], {
            '--blur': '0px',
          })
        })
      }
    },
    mapStatus(nextMapStatus) {
      // delete marker on the map
      this.marks.forEach((mark, i) => {
        this.marks[i].setMap(null)
        this.marks[i].setVisible(false)
        google.maps.event.clearListeners(this.marks[i], 'click')
      })
      this.marks = []

      //  reset center
      this.resetMarker()
      this.map.setCenter(new google.maps.LatLng(25.092305, 121.527679))

      // reset markers on the map
      this.allMarks
        .filter((mark) =>
          process.env.VUE_APP_MODE === 'DEVELOP'
            ? true
            : mark.type === nextMapStatus.nowMapType
        )
        .forEach((mark, i) => {
          this.setMarker(mark, i)
        })

      this.startPositionTimer()
    },
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: this.lat, lng: this.lng },
        mapId: '18a08e4ec06cb879',
        zoom: 15,
        maxZoom: 20,
        minZoom: 3,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      })
    },
    setMarker(
      {
        latitude,
        longitude,
        id,
        title,
        titleEN,
        message,
        contact,
        triggerDistance,
        type,
      },
      index
    ) {
      let iconStyle = {}

      if (this.mapStatus.passNode.includes(id)) {
        iconStyle = {
          ...this.svgMarkerIcon,
          path: 'M40 33.71C40 36.05 37.83 38.19 33.9 39.73C30.18 41.19 25.24 42 20 42C14.76 42 9.82 41.19 6.1 39.73C2.17 38.18 0 36.04 0 33.71C0 31.38 2.17 29.23 6.1 27.69C7.69 27.07 9.5 26.56 11.46 26.19C11.72 26.63 11.98 27.06 12.24 27.49C10.17 27.85 8.27 28.37 6.62 29.01C3.32 30.31 1.42 32.02 1.42 33.71C1.42 35.4 3.32 37.11 6.62 38.41C10.18 39.81 14.93 40.58 20 40.58C25.07 40.58 29.82 39.81 33.38 38.41C36.68 37.11 38.58 35.4 38.58 33.71C38.58 32.02 36.68 30.31 33.38 29.01C31.73 28.36 29.83 27.85 27.76 27.49C28.02 27.06 28.28 26.63 28.54 26.19C30.5 26.56 32.31 27.07 33.9 27.69C37.83 29.24 40 31.38 40 33.71ZM20 34.46C18.89 34.46 7.96 19.61 7.96 12.02C7.96 5.38 13.35 0 20 0C26.65 0 32.04 5.38 32.04 12.01C32.04 19.6 21.11 34.45 20 34.45V34.46ZM25.15 17.17C24.96 16.55 24.68 15.99 24.39 15.42C23.79 14.32 23 13.21 22.08 12.16C23.44 10.62 24.54 8.89 25.15 7.14C23.41 7.75 21.67 8.85 20.13 10.2C18.59 8.85 16.85 7.75 15.11 7.14C15.72 8.88 16.82 10.62 18.18 12.16C17.26 13.21 16.47 14.32 15.87 15.42C15.57 15.98 15.3 16.54 15.11 17.17C15.73 16.98 16.3 16.71 16.86 16.41C17.96 15.81 19.08 15.02 20.13 14.1C21.18 15.02 22.3 15.81 23.4 16.41C23.96 16.71 24.53 16.98 25.15 17.17Z',
          fillColor: '#858585',
        }
      } else if (type === 3) {
        iconStyle = {
          ...this.svgMarkerIcon,
          path: 'M43.1502 43.79C43.1502 46.13 40.9802 48.27 37.0502 49.81C33.3302 51.27 28.3902 52.08 23.1502 52.08C17.9102 52.08 12.9702 51.27 9.25023 49.81C5.32023 48.26 3.15023 46.12 3.15023 43.79C3.15023 41.46 5.32023 39.31 9.25023 37.77C10.8402 37.15 12.6502 36.64 14.6102 36.27C14.8702 36.71 15.1302 37.14 15.3902 37.57C13.3202 37.93 11.4202 38.45 9.77024 39.09C6.47023 40.39 4.57023 42.1 4.57023 43.79C4.57023 45.48 6.47023 47.19 9.77024 48.49C13.3302 49.89 18.0802 50.66 23.1502 50.66C28.2202 50.66 32.9702 49.89 36.5302 48.49C39.8302 47.19 41.7302 45.48 41.7302 43.79C41.7302 42.1 39.8302 40.39 36.5302 39.09C34.8802 38.44 32.9802 37.93 30.9102 37.57C31.1702 37.14 31.4302 36.71 31.6902 36.27C33.6502 36.64 35.4602 37.15 37.0502 37.77C40.9802 39.32 43.1502 41.46 43.1502 43.79ZM45.5502 22.23C43.7402 21.28 41.8902 20.64 39.9802 20.04C36.2002 18.94 31.9702 18.21 27.6102 17.92C27.1902 11.5 25.8002 5.21 23.2702 0C20.7502 5.2 19.3502 11.49 18.9302 17.9C12.5102 18.32 6.21023 19.71 0.990234 22.23C6.21023 24.75 12.5102 26.14 18.9502 26.56C19.2502 30.91 19.9702 35.13 21.0802 38.9C21.6702 40.8 22.3102 42.66 23.2702 44.46C24.2202 42.66 24.8702 40.81 25.4602 38.9C26.5702 35.12 27.2902 30.9 27.5902 26.54C31.9602 26.24 36.1902 25.52 39.9802 24.42C41.8902 23.83 43.7402 23.19 45.5502 22.24V22.23Z',
          fillColor: '#00BECC',
        }
      } else {
        iconStyle = this.svgMarkerIcon
      }

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        icon: iconStyle,
        map: this.map,
        id,
        title,
        message,
        contact,
        titleEN,
        index,
        triggerDistance,
        type,
        isPass: this.mapStatus.passNode.includes(id),
      })

      this.marks.push(marker)

      google.maps.event.addListener(marker, 'click', (_) => {
        this.resetMarkerStyle()
        this.isShowLocation = false
        if (this.nowMark?.id !== marker.id) {
          this.nowMark = marker
          if (
            marker.type === 3 &&
            !this.mapStatus.passNode.includes(marker.id)
          ) {
            marker.setIcon({
              ...this.svgMarkerIcon,
              path: 'M43.1502 43.79C43.1502 46.13 40.9802 48.27 37.0502 49.81C33.3302 51.27 28.3902 52.08 23.1502 52.08C17.9102 52.08 12.9702 51.27 9.25023 49.81C5.32023 48.26 3.15023 46.12 3.15023 43.79C3.15023 41.46 5.32023 39.31 9.25023 37.77C10.8402 37.15 12.6502 36.64 14.6102 36.27C14.8702 36.71 15.1302 37.14 15.3902 37.57C13.3202 37.93 11.4202 38.45 9.77024 39.09C6.47023 40.39 4.57023 42.1 4.57023 43.79C4.57023 45.48 6.47023 47.19 9.77024 48.49C13.3302 49.89 18.0802 50.66 23.1502 50.66C28.2202 50.66 32.9702 49.89 36.5302 48.49C39.8302 47.19 41.7302 45.48 41.7302 43.79C41.7302 42.1 39.8302 40.39 36.5302 39.09C34.8802 38.44 32.9802 37.93 30.9102 37.57C31.1702 37.14 31.4302 36.71 31.6902 36.27C33.6502 36.64 35.4602 37.15 37.0502 37.77C40.9802 39.32 43.1502 41.46 43.1502 43.79ZM45.5502 22.23C43.7402 21.28 41.8902 20.64 39.9802 20.04C36.2002 18.94 31.9702 18.21 27.6102 17.92C27.1902 11.5 25.8002 5.21 23.2702 0C20.7502 5.2 19.3502 11.49 18.9302 17.9C12.5102 18.32 6.21023 19.71 0.990234 22.23C6.21023 24.75 12.5102 26.14 18.9502 26.56C19.2502 30.91 19.9702 35.13 21.0802 38.9C21.6702 40.8 22.3102 42.66 23.2702 44.46C24.2202 42.66 24.8702 40.81 25.4602 38.9C26.5702 35.12 27.2902 30.9 27.5902 26.54C31.9602 26.24 36.1902 25.52 39.9802 24.42C41.8902 23.83 43.7402 23.19 45.5502 22.24V22.23Z',
              fillColor: '#CCFDFF',
            })
          } else if (!this.mapStatus.passNode.includes(marker.id)) {
            marker.setIcon({
              ...this.svgMarkerIcon,
              fillColor: '#FF8133',
            })
          }
          this.map.panTo(
            new google.maps.LatLng(marker.position.lat(), marker.position.lng())
          )
          setTimeout(() => {
            this.smoothZoomIn(18, this.map.getZoom())
          }, 300)
        } else {
          this.resetMarker()
        }

        this.sfxList['map-touch'].play()
      })
    },
    resetMarkerStyle() {
      // reset mark style
      this.marks
        .filter(
          (mark) =>
            !this.mapStatus.passNode.includes(mark.id) && mark.type !== 3
        )
        .forEach((mark) => mark.setIcon(this.svgMarkerIcon))
      // reset type 3 mark style
      this.marks
        .filter(
          (mark) =>
            !this.mapStatus.passNode.includes(mark.id) && mark.type === 3
        )
        .forEach((mark) =>
          mark.setIcon({
            ...this.svgMarkerIcon,
            path: 'M43.1502 43.79C43.1502 46.13 40.9802 48.27 37.0502 49.81C33.3302 51.27 28.3902 52.08 23.1502 52.08C17.9102 52.08 12.9702 51.27 9.25023 49.81C5.32023 48.26 3.15023 46.12 3.15023 43.79C3.15023 41.46 5.32023 39.31 9.25023 37.77C10.8402 37.15 12.6502 36.64 14.6102 36.27C14.8702 36.71 15.1302 37.14 15.3902 37.57C13.3202 37.93 11.4202 38.45 9.77024 39.09C6.47023 40.39 4.57023 42.1 4.57023 43.79C4.57023 45.48 6.47023 47.19 9.77024 48.49C13.3302 49.89 18.0802 50.66 23.1502 50.66C28.2202 50.66 32.9702 49.89 36.5302 48.49C39.8302 47.19 41.7302 45.48 41.7302 43.79C41.7302 42.1 39.8302 40.39 36.5302 39.09C34.8802 38.44 32.9802 37.93 30.9102 37.57C31.1702 37.14 31.4302 36.71 31.6902 36.27C33.6502 36.64 35.4602 37.15 37.0502 37.77C40.9802 39.32 43.1502 41.46 43.1502 43.79ZM45.5502 22.23C43.7402 21.28 41.8902 20.64 39.9802 20.04C36.2002 18.94 31.9702 18.21 27.6102 17.92C27.1902 11.5 25.8002 5.21 23.2702 0C20.7502 5.2 19.3502 11.49 18.9302 17.9C12.5102 18.32 6.21023 19.71 0.990234 22.23C6.21023 24.75 12.5102 26.14 18.9502 26.56C19.2502 30.91 19.9702 35.13 21.0802 38.9C21.6702 40.8 22.3102 42.66 23.2702 44.46C24.2202 42.66 24.8702 40.81 25.4602 38.9C26.5702 35.12 27.2902 30.9 27.5902 26.54C31.9602 26.24 36.1902 25.52 39.9802 24.42C41.8902 23.83 43.7402 23.19 45.5502 22.24V22.23Z',
            fillColor: '#00BECC',
          })
        )
    },
    handleClick() {
      if (this.nowMark.type === 1) this.handlePhoneCall()
      else this.isPhoneCallShow = true
    },
    handleLocationClick() {
      if (this.locationTimer) clearTimeout(this.locationTimer)
      this.locationTimer = setTimeout(this.resetMarker, 800)

      if (this.currentLocation && !this.isShowLocation) {
        this.resetMarkerStyle()
        this.isShowLocation = true
        this.map.panTo(
          new google.maps.LatLng(
            this.currentLocation.position.lat(),
            this.currentLocation.position.lng()
          )
        )
      } else {
        this.isShowLocation = false
        this.map.panTo(
          new google.maps.LatLng(
            this.marks[0].position.lat(),
            this.marks[0].position.lng()
          )
        )
      }
    },
    handleMenuClick() {
      this.onMenuClick()
    },
    handlePhoneCall() {
      this.clearPositionTimer()
      this.isPhoneCallShow = false
      this.onPhoneCallClick(this.nowMark)
    },
    updatePosition() {
      navigator.geolocation.getCurrentPosition((pos) => {
        const nextLatlng = new google.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        )
        this.currentLocation.setPosition(nextLatlng)
        this.marksDistance = this.marks.map((mark, i) => {
          return process.env.VUE_APP_MODE === 'DEVELOP'
            ? 0
            : this.getDistance(nextLatlng, mark.position)
        })
      })
    },
    getDistance(source, destination) {
      return google.maps.geometry.spherical.computeDistanceBetween(
        source,
        destination
      )
    },
    smoothZoomIn(max, cnt) {
      if (cnt < max) {
        const zoomEvent = google.maps.event.addListener(
          this.map,
          'zoom_changed',
          (event) => {
            google.maps.event.removeListener(zoomEvent)
            this.smoothZoomIn(max, cnt + 1)
          }
        )
        setTimeout(() => {
          this.map.setZoom(cnt)
        }, 80)
      }
    },
    smoothZoomOut(min, cnt) {
      if (cnt >= min) {
        const zoomEvent = google.maps.event.addListener(
          this.map,
          'zoom_changed',
          (event) => {
            google.maps.event.removeListener(zoomEvent)
            this.smoothZoomOut(min, cnt - 1)
          }
        )
        setTimeout(() => {
          this.map.setZoom(cnt)
        }, 80)
      }
    },
    resetMarker() {
      this.nowMark = null
      this.smoothZoomOut(15, this.map.getZoom())
    },
    startPositionTimer() {
      this.clearPositionTimer()

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.currentLocation = new google.maps.Marker({
            position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            icon: mapMine,
            map: this.map,
          })

          setTimeout(this.updatePosition, 1000)
          this.updatePositionTimer = setInterval(this.updatePosition, 5000)
        })
      }
    },
    clearPositionTimer() {
      clearInterval(this.updatePositionTimer)
      this.updatePositionTimer = null
    },
  },
  mounted() {
    this.initMap()

    new FrontendAPI().getAllMapNodes(this.token).then((d) => {
      if (d.status === 200) {
        this.allMarks = d.data.data
        d.data.data
          .filter((mark) =>
            process.env.VUE_APP_MODE === 'DEVELOP'
              ? true
              : mark.type === this.mapStatus.nowMapType
          )
          .forEach((mark, i) => {
            this.setMarker(mark, i)
          })

        this.map.setCenter(new google.maps.LatLng(25.092305, 121.527679))
      }
    })

    this.startPositionTimer()
  },
  unmounted() {
    this.clearPositionTimer()
  },
  props: ['token', 'onPhoneCallClick', 'mapStatus', 'sfxList', 'onMenuClick'],
}
</script>
<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 100%;
  filter: blur(var(--blur));
}

.o-map {
  width: 100%;
  height: 100%;

  --mask-height: 120%;
  --blur: 0;

  &__top {
    position: fixed;
    width: 100%;
    height: 150px;
    top: -20px;
    z-index: 1;
    filter: blur(var(--blur));

    &-border {
      width: 100%;
      height: 100%;
    }

    &-text {
      position: absolute;
      font-family: Montserrat, sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 3px;
      text-align: center;
      color: #ffc499;
      top: 0;
      padding-top: 40px;
      margin: 0;
      width: 100%;
    }

    &-button {
      &-location {
        position: absolute;
        top: 45px;
        left: 5px;
      }

      &-menus {
        position: absolute;
        top: 45px;
        right: 5px;
      }
    }

    &-scale {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 30%;
      max-width: 150px;
    }
  }

  &__info {
    filter: blur(var(--blur));
  }

  &__phone-call {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
