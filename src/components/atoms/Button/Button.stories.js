import Button from './Button'

export default {
    title: 'components/Button',
    component: Button,
}

const Template = (args) => ({
    components: { Button },
    setup() {
        return { args };
    },
    template: '<Button v-bind="args" />',
})

export const Primary = Template.bind({});
Primary.args = {
  label: 'Button',
};