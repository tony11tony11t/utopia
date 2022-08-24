<template>
  <a-modal :visible="visible" :handleCancel="handleCancel"></a-modal>
  <div class="google-map" id="map" ref="map"></div>
</template>
<script>
import FrontendAPI from '@/api'
import aModal from '../../atoms/aModal'

export default {
  data() {
    return {
      map: null,
      lat: 25.0325917,
      lng: 121.5624999,
      marks: [],
      visible: false,
    }
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: this.lat, lng: this.lng },
        zoom: 15,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      })
    },
    setMarker(lat, lng) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
      })
      marker.addListener('click', () => {
        this.visible = true
      })
      this.marks.push(marker)
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
    handleCancel(e) {
      this.visible = false
    },
  },
  mounted() {
    const api = new FrontendAPI()
    this.initMap()
    api.getAllMapNodes(this.token).then((d) => {
      if (d.status === 200) {
        d.data.data.forEach((mark) => {
          this.setMarker(mark.latitude, mark.longitude)
        })
        this.map.setCenter(this.marks[0].position)
      }
    })

    /* setInterval(() => {
      this.updatePosition()
    }, 5000) */
  },
  components: {
    aModal,
  },
  props: ['token'],
}
</script>
<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 100%;
}
</style>
