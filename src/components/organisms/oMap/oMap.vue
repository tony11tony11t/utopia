<template>
  <div class="o-map" ref="o-map">
    <div class="o-map__top">
      <img
        src="../../../assets/mapTop.png"
        alt="mapTop"
        class="o-map__top-border"
      />
      <p class="o-map__top-text">{{ nowLatLng }}</p>
    </div>
    <div class="google-map" id="map" ref="map"></div>
    <mMapInfo :mark="nowMark" :onClick="handleClick" class="o-map__info" />
    <mPhoneCall
      v-if="isPhoneCallShow"
      :contact="nowMark?.contact"
      class="o-map__phone-call"
      ref="phone-call"
      :onClick="() => onPhoneCallClick(nowMark)"
    />
  </div>
</template>
<script>
import gsap from 'gsap'
import FrontendAPI from '@/api'
import mPhoneCall from '@/components/molecules/mPhoneCall'
import convertDMS from '../../../utils/convertDMS'
import mMapInfo from '../../molecules/mMapInfo'

export default {
  data() {
    return {
      map: null,
      lat: 25.0325917,
      lng: 121.5624999,
      marks: [],
      visible: false,
      nowMark: null,
      isInfoOpen: false,
      isPhoneCallShow: false,
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
          gsap.to(this.$refs['o-map'], {
            '--blur': '3px',
          })
          gsap.to(this.$refs['phone-call'].$el, {
            opacity: 1,
            pointerEvents: 'auto',
          })
        })
      }
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
    setMarker({ latitude, longitude, id, title, message, contact }) {
      const svgIcon = {
        path: 'M40 33.71C40 36.05 37.83 38.19 33.9 39.73C30.18 41.19 25.24 42 20 42C14.76 42 9.82 41.19 6.1 39.73C2.17 38.18 0 36.04 0 33.71C0 31.38 2.17 29.23 6.1 27.69C7.69 27.07 9.5 26.56 11.46 26.19C11.72 26.63 11.98 27.06 12.24 27.49C10.17 27.85 8.27 28.37 6.62 29.01C3.32 30.31 1.42 32.02 1.42 33.71C1.42 35.4 3.32 37.11 6.62 38.41C10.18 39.81 14.93 40.58 20 40.58C25.07 40.58 29.82 39.81 33.38 38.41C36.68 37.11 38.58 35.4 38.58 33.71C38.58 32.02 36.68 30.31 33.38 29.01C31.73 28.36 29.83 27.85 27.76 27.49C28.02 27.06 28.28 26.63 28.54 26.19C30.5 26.56 32.31 27.07 33.9 27.69C37.83 29.24 40 31.38 40 33.71ZM20 34.46C18.89 34.46 7.96 19.61 7.96 12.02C7.96 5.38 13.35 0 20 0C26.65 0 32.04 5.38 32.04 12.01C32.04 19.6 21.11 34.45 20 34.45V34.46ZM27.23 12.15C26.65 11.85 26.06 11.64 25.45 11.45C24.24 11.1 22.9 10.87 21.51 10.77C21.38 8.72 20.93 6.72 20.13 5.05C19.33 6.71 18.88 8.71 18.75 10.76C16.7 10.89 14.69 11.34 13.03 12.14C14.69 12.94 16.7 13.39 18.76 13.52C18.85 14.91 19.09 16.25 19.44 17.46C19.63 18.07 19.83 18.66 20.14 19.23C20.44 18.66 20.65 18.06 20.84 17.46C21.19 16.25 21.42 14.91 21.52 13.52C22.91 13.43 24.26 13.2 25.47 12.84C26.08 12.65 26.67 12.45 27.25 12.14L27.23 12.15Z',
        fillColor: '#B566FF',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.8,
      }

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        icon: svgIcon,
        map: this.map,
        id,
        title,
        message,
        contact,
      })

      this.marks.push(marker)

      google.maps.event.addListener(marker, 'click', (_) => {
        this.marks.forEach((mark) => mark.setIcon(svgIcon))
        if (this.nowMark?.id !== marker.id) {
          this.nowMark = marker
          marker.setIcon({
            ...svgIcon,
            fillColor: '#FF8133',
          })
          this.map.panTo(
            new google.maps.LatLng(marker.position.lat(), marker.position.lng())
          )
          setTimeout(() => {
            this.smoothZoomIn(18, this.map.getZoom())
          }, 300)
        } else {
          this.resetMarker()
        }
      })
    },
    handleClick() {
      this.isPhoneCallShow = true
    },
    updatePosition() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const nextLatlng = new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
          )
          this.map.setCenter(nextLatlng)
          this.marks.forEach((mark) => {
            console.log(this.getDistance(nextLatlng, mark.position))
          })
        })
      }
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
  },
  mounted() {
    const api = new FrontendAPI()
    this.initMap()
    api.getAllMapNodes(this.token).then((d) => {
      if (d.status === 200) {
        d.data.data.forEach((mark) => {
          this.setMarker(mark)
        })
        this.map.setCenter(this.marks[0].position)
      }
    })
  },
  props: ['token', 'onPhoneCallClick'],
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

  --mask-height: 95%;
  --blur: 0;

  &__top {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1;
    filter: blur(var(--blur));

    &-border {
      width: 100%;
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
      padding-top: 10%;
      margin: 0;
      width: 100%;
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
