<template>
  <div class="o-menu" v-if="data.length > 0">
    <div
      class="o-menu__bg"
      :style="{
        'backgroundImage': `url(${require(`@/assets/bgMenu.png`)})`,
      }"
    ></div>
    <div class="o-menu__container">
      <img
        svg-inline
        src="../../../assets/logo.svg"
        alt="logo"
        class="o-menu__logo"
      />
      <img
        svg-inline
        src="../../../assets/descriptionHeaderDivide.svg"
        alt="line"
        class="o-menu__line"
      />
      <img
        svg-inline
        src="../../../assets/logoEn.svg"
        alt="logo"
        class="o-menu__logo-en"
      />
      <div class="o-menu__list">
        <v-expansion-panels>
          <v-expansion-panel v-for="(tab, i) in data" :key="i">
            <v-expansion-panel-title hide-actions>
              <p class="o-menu__title-zh">{{ tab.zh }}</p>
              <p class="o-menu__title-en">{{ tab.en }}</p>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="o-menu__info">
              <p class="o-menu__info-description">
                {{ tab.description }}
              </p>
              <img
                v-for="n in 4"
                :key="n"
                svg-inline
                class="o-menu__info-cross"
                src="../../../assets/icons/cross.svg"
                alt="cross"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <p
        v-if="isResetShow"
        class="o-menu__develop-reset"
        @click="handleResetClick"
        @keydown="handleResetClick"
      >
        重置
      </p>
    </div>
    <img
      svg-inline
      src="../../../assets/icons/prev.svg"
      alt="prev"
      class="o-menu__prev"
      @click="onPrevClick"
      @keydown="onPrevClick"
    />
  </div>
</template>
<script>
import axios from 'axios'
import FrontendAPI from '@/api'

export default {
  data() {
    return {
      data: [],
      isResetShow: process.env.VUE_APP_MODE === 'DEVELOP',
    }
  },
  props: ['onPrevClick', 'token'],
  methods: {
    handleResetClick() {
      new FrontendAPI().resetUserPassNode(this.token).then((d) => {
        if (d.status === 200) {
          window.location.reload()
        }
      })
    },
  },
  mounted() {
    axios.get(`./database/menuDescription.json`).then((response) => {
      if (response.status === 200) {
        this.data = response.data.menu
      }
    })
  },
}
</script>
<style lang="scss" scoped>
.o-menu {
  position: absolute;

  &__bg {
    position: fixed;
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
  }

  &__container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
  }

  &__line {
    margin-top: 20px;
    margin-bottom: 30px;
  }

  &__logo {
    &-en {
      margin-bottom: 20px;
    }
  }

  &__title {
    &-zh {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 32px;
      line-height: 46px;
      text-align: center;
      letter-spacing: 0.3em;
      color: #adadad;
    }

    &-en {
      font-family: Montserrat, sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
      letter-spacing: 0.3em;
      color: #adadad;
      transform: scale(-1);
    }
  }

  &__info {
    position: relative;
    margin: 0 20px;

    &::before,
    &::after {
      content: '';
      display: block;
      position: relative;
      top: 15px;
      height: calc(100% - 30px);
      width: 2px;
      background-color: #0c001f;
      box-shadow: 1px 0 1.5px rgba(255, 255, 255, 0.26);
    }

    &-description {
      font-family: 'Glow Sans TC', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
      line-height: 28px;
      text-align: justify;
      letter-spacing: 0.05em;
      color: #cfcfcf;
    }

    &-cross {
      width: 15px;
      position: absolute;

      &:nth-of-type(1) {
        top: 0;
        left: -7.5px;
      }

      &:nth-of-type(2) {
        top: 0;
        right: -7.5px;
      }

      &:nth-of-type(3) {
        bottom: 0;
        left: -7.5px;
      }

      &:nth-of-type(4) {
        bottom: 0;
        right: -7.5px;
      }
    }
  }

  &__prev {
    position: absolute;
    top: 30px;
    left: 20px;
  }

  .v-expansion-panel--active {
    .o-menu__info {
      height: calc(100% - 95px);
    }
  }

  &__develop-reset {
    margin-top: 100px;
    font-family: 'Glow Sans TC', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 32px;
    line-height: 46px;
    text-align: center;
    letter-spacing: 0.3em;
    color: #adadad;
  }
}
</style>
