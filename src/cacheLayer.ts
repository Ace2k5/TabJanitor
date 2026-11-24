import type { FirstLayer, SecondLayer } from './types/types.js'

export class CacheLayer {
    firstLayer: Map<string, FirstLayer>;
    secondLayer: Map<string, SecondLayer>;
    excluded: Array<string>
    initial_time: number

    constructor() {
        this.firstLayer = new Map<string, FirstLayer>()
        this.secondLayer = new Map<string, SecondLayer>()
        this.excluded = new Array<string>()
        this.initial_time = Date.now()
    }

    inputTab(tab: string): void {
        if (!this.firstLayer.has(tab)) {
        this.firstLayer.set(tab, { tab, time_accessed: Date.now() })
        }
    }

    checkPeriodically(): void {
        const now = Date.now()
        const elapsed_time = now - this.initial_time
        const thresholdMS = 6_000

        if (elapsed_time < thresholdMS) {
            return;
        }

        this.checkFirstLayer(now)
        this.checkSecondLayer(now)
        this.initial_time = Date.now()
    }

    checkFirstLayer(ms: number): void {
        const thresholdMS = 600_000

        for (const [key, value] of this.firstLayer) {
            const idleMS = ms - value.time_accessed

            if (idleMS < thresholdMS) {
                break;
            }
            this.secondLayer.set(key, value)
            this.firstLayer.delete(key)

        };
    }

    checkSecondLayer(ms: number): void {
        const thresholdMS = 3_600_000

        for (const [key, value] of this.secondLayer) {
            const idleMS = ms - value.time_accessed

            if (idleMS < thresholdMS) {
                break;
            }
            this.secondLayer.delete(key)
        }
        
    }

    addExclusion(tab: string): void {
        if (this.firstLayer.has(tab)) {
            this.excluded.push(tab)
            this.firstLayer.delete(tab)
        }
        if (this.secondLayer.has(tab)) {
            this.excluded.push(tab)
            this.secondLayer.delete(tab)
        }

    }

}