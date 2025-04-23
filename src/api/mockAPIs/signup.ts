import { useState, useEffect, useCallback } from 'react';
import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.1/dist/browser/+esm";

interface UseMockAPIReturn {
  response: string | null;
  loading: boolean;
  error: any;
  request: (endpoint: string, params?: any) => Primise<void>;
}

function useMockAPI(endpoint: string, requestData?: any): UseMockAPIReturn {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [rubyVM, setRubyVM] = useState<ReturnType<typeof DefaultRubyVM> | null>(null);
  const wasmURL = "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.1/dist/ruby+stdlib.wasm";

  // ruby.wasmの初期化
  useEffect(() => {
    async function initializeRuby() {
      try {
        setLoading(true);
        const response = await fetch(wasmURL);
        const module = await WebAssembly.compileStreaming(response);
        const { vm } = await DefaultRubyVM(module);
        setRubyVM(vm);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    initializeRuby();
  }, []);

  const request = useCallback(async (endpoint: string, params?: any) => {
    if (!rubyVM) {
      console.warn("RubyVM is not initialied yet");
      return;
    }

    setLoading(true);
    setError(null);
    const endpointJson = JSON.stringify(endpoint);
    const requestDataJson = JSON.stringify(requestData);

    const rubyCode = `
      require 'json'

      endpoint = JSON.parse('${endpointJson}')
      request_data = JSON.parse('${requestDataJson}')

      case endpoint
      when '/users'
        users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
        JSON.generate(users)
      when '/products/123'
        product = { id: 123, name: "Awesome Gadget", price: 99.99 }
        JSON.generate(product)
      when '/submit'
        if request_data && request_data['data']
          response = { message: "Data received successfully", received: request_data['data'] }
          JSON.generate(response)
        else
          JSON.generate({ error: "Invalid request data" })
        end
      else
        JSON.generate({ error: "Endpoint not found" })
      end
    `;

    try {
      const result = await rubyVM.eval(rubyCode);
      setResponse(result);
      setLoading(false);
    } catch (err) {
      setError(err);
      setResponse(JSON.stringify({ error: "Internal Server Error" }));
      setLoading(false);
    }
  }, [rubyVM]);

  return { response, loading, error, request };
}

export default useMockAPI;