import { describe, it, expect } from 'vitest'
import { CacheLayer } from './cacheLayer.js'

describe('CacheLayer', () => {
    it('should add a tab to the first layer', () => {
        const cache = new CacheLayer()
        cache.inputTab('https://example.com')
        expect(cache.firstLayer.has('https://example.com')).toBe(true)
    })
})

describe('CacheLayer', () => {
    it('should add an exclusion', () => {
        const cache = new CacheLayer()
        cache.inputTab('https://example.com')
        cache.addExclusion('https://example.com')
        expect(cache.excluded.includes('https://example.com')).toBe(true)
        expect(cache.firstLayer.has('https://example.com')).toBe(false)
    })
})