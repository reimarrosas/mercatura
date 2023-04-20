import { describe, it, expect  } from "vitest";

import { mount } from '@vue/test-utils'

import HelloWorldVue from "../HelloWorld.vue";

describe('Hello World Component', () => {
    it('should render `Hello, World!`', () => {
        const wrapper = mount(HelloWorldVue)

        expect(wrapper.text()).toBe('Hello, World!')
    })
})