declare module 'ping' {
  interface PingOptions {
    numeric?: boolean;
    timeout?: number;
    min_reply?: number;
    extra?: string[];
  }

  interface PingResponse {
    host: string;
    numeric_host: string;
    alive: boolean;
    output: string;
    time: number;
    min: string;
    max: string;
    avg: string;
    stddev: string;
    packetLoss: string;
  }

  export const promise: {
    probe(addr: string, config?: PingOptions): Promise<PingResponse>;
  };
}

declare module 'traceroute' {
  export function trace(
    host: string,
    callback: (err: Error | null, hops: any[]) => void
  ): void;
}
