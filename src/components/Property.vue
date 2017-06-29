<template>
  <div v-if="className === 'TextfieldProperty'">
    <textfield-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></textfield-property>
  </div>
  <div v-else-if="className === 'TextareaProperty'">
    <textarea-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></textarea-property>
  </div>
  <div v-else-if="className === 'RichtextProperty'">
    <richtext-property v-on:update="update(arguments[0])" v-on:save="save()" :className="className" :mode="mode" :view="view"></richtext-property>
  </div>
  <div v-else-if="className === 'DatetimeProperty'">
    <datetime-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></datetime-property>
  </div>
  <div v-else-if="className === 'DateProperty'">
    <date-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></date-property>
  </div>
  <div v-else-if="className === 'IntegerProperty'">
    <integer-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></integer-property>
  </div>
  <div v-else-if="className === 'FloatProperty'">
    <float-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></float-property>
  </div>
  <div v-else-if="className === 'ImageProperty'">
    <image-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></image-property>
  </div>
  <div v-else-if="className === 'OneToOneProperty'">
    <onetoone-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></onetoone-property>
  </div>
  <div v-else-if="className === 'CheckboxProperty'">
    <checkbox-property v-on:update="update(arguments[0])" :className="className" :mode="mode" :view="view"></checkbox-property>
  </div>
  <div v-else-if="className === 'VirtualProperty'">
    <virtual-property :className="className" :mode="mode" :view="view"></virtual-property>
  </div>
  <div v-else>
    <div v-if="mode === 'browse'">
      <div v-html="view.value"></div>
    </div>
    <div v-else-if="mode === 'link'">
      <div class="label textfield"><span>{{ view.title }}</span></div>
    </div>
    <div v-else-if="mode === 'search'">
      <div class="label textfield"><span>{{ view.title }}</span></div>
      <div><input type="text" :value="view.value" placeholder=""></div>
    </div>
  </div>
</template>

<script>
import TextfieldProperty from '@/components/properties/TextfieldProperty'
import TextareaProperty from '@/components/properties/TextareaProperty'
import RichtextProperty from '@/components/properties/RichtextProperty'
import DatetimeProperty from '@/components/properties/DatetimeProperty'
import DateProperty from '@/components/properties/DateProperty'
import IntegerProperty from '@/components/properties/IntegerProperty'
import FloatProperty from '@/components/properties/FloatProperty'
import ImageProperty from '@/components/properties/ImageProperty'
import OnetooneProperty from '@/components/properties/OnetooneProperty'
import CheckboxProperty from '@/components/properties/CheckboxProperty'
import VirtualProperty from '@/components/properties/VirtualProperty'

export default {
  name: 'property',
  components: {
    TextfieldProperty,
    TextareaProperty,
    RichtextProperty,
    DatetimeProperty,
    DateProperty,
    IntegerProperty,
    FloatProperty,
    ImageProperty,
    OnetooneProperty,
    CheckboxProperty,
    VirtualProperty
  },
  props: ['className', 'mode', 'view'],
  data () {
    return {

    }
  },
  mounted () {
    // this.update({value: this.view.value})
  },
  methods: {
    update (value) {
      this.$emit('update', this.view.name, value)
    },
    save () {
      this.$emit('save')
    }
  }
}
</script>
