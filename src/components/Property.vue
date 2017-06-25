<template>
  <div v-if="className === 'TextfieldProperty'">
    <textfield-property :className="className" :mode="mode" :view="view" :model="model"></textfield-property>
  </div>
  <div v-else-if="className === 'TextareaProperty'">
    <textarea-property :className="className" :mode="mode" :view="view" :model="model"></textarea-property>
  </div>
  <div v-else-if="className === 'RichtextProperty'">
    <richtext-property :className="className" :mode="mode" :view="view" :model="model"></richtext-property>
  </div>
  <div v-else-if="className === 'DatetimeProperty'">
    <datetime-property :className="className" :mode="mode" :view="view" :model="model"></datetime-property>
  </div>
  <div v-else-if="className === 'DateProperty'">
    <date-property :className="className" :mode="mode" :view="view" :model="model"></date-property>
  </div>
  <div v-else-if="className === 'OneToOneProperty'">
    <onetoone-property :className="className" :mode="mode" :view="view" :model="model"></onetoone-property>
  </div>
  <div v-else-if="className === 'CheckboxProperty'">
    <checkbox-property :className="className" :mode="mode" :view="view" :model="model"></checkbox-property>
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
import OnetooneProperty from '@/components/properties/OnetooneProperty'
import CheckboxProperty from '@/components/properties/CheckboxProperty'

export default {
  name: 'property',
  components: {
    TextfieldProperty,
    TextareaProperty,
    RichtextProperty,
    DatetimeProperty,
    DateProperty,
    OnetooneProperty,
    CheckboxProperty
  },
  props: ['className', 'mode', 'view', 'model']
}
</script>
