import { useState, useEffect, useCallback } from 'react';
import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.1/dist/browser/+esm";

interface UseMockAPIReturn {
  response: Record<string, any> | null;
  loading: boolean;
  error: any;
  request: (endpoint: string, params?: any) => Primise<void>;
}

function useMockAPI(): UseMockAPIReturn {
  const [response, setResponse] = useState<Record<string, any> | null>(null);
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
    const requestDataJson = JSON.stringify(params);

    const rubyCode = `
      require 'json'

      endpoint = JSON.parse('${endpointJson}')
      request_data = JSON.parse('${requestDataJson}')

      case endpoint
        when "/session"
        users = [
          { id: 1, name: "ダイチ", email_address: "kamada@sample.com", password: "foobar0101" },
          { id: 2, name: "カオル", email_address: "mitoma@sample.com", password: "foobar0101" },
          { id: 3, name: "ワタル", email_address: "endo@sample.com", password: "foobar0101" }
        ]

        authorized_user = users.find do |user|
          user[:email_address] == request_data["user"]["email_address"] && user[:password] == request_data["user"]["password"]
        end

        if authorized_user
          authorized_user_without_credentials = { id: authorized_user[:id], name: authorized_user[:name] }
          JSON.generate(authorized_user_without_credentials)
        end
      end
    `;

    try {
      const result = await rubyVM.eval(rubyCode);
      setResponse({ data: JSON.parse(result.toString())});
      setLoading(false);
    } catch (err) {
      setError(err);
      setResponse({ error: "Internal Server Error" });
      setLoading(false);
    }
  }, [rubyVM]);

  return { response, loading, error, request };
}

export default useMockAPI;