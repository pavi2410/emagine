export type StreamEvent = 
  | { type: 'token'; text: string }
  | { type: 'status'; data: any }

type StreamListener = (event: StreamEvent) => void

class StreamPubSub {
  private listeners = new Map<string, Set<StreamListener>>()

  subscribe(appId: string, listener: StreamListener) {
    if (!this.listeners.has(appId)) {
      this.listeners.set(appId, new Set())
    }
    this.listeners.get(appId)!.add(listener)
    
    return () => {
      const set = this.listeners.get(appId)
      if (set) {
        set.delete(listener)
        if (set.size === 0) {
          this.listeners.delete(appId)
        }
      }
    }
  }

  publish(appId: string, event: StreamEvent) {
    this.listeners.get(appId)?.forEach(listener => listener(event))
  }
}

export const streamPubSub = new StreamPubSub()
