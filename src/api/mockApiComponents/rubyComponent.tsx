import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.1/dist/browser/+esm";
import { useEffect, useState } from "react";

function RubyComponent() {
  const [rubyOutput, setRubyOutput] = useState<string>('');

  useEffect(() => {
    async function initRuby() {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.1/dist/ruby+stdlib.wasm");
        const module = await WebAssembly.compileStreaming(response);
        const { vm } = await DefaultRubyVM(module);

        const result = vm.eval(`
          require "js"
          JS.global[:document].write "Hello, world!"
        `);
        setRubyOutput(result)
      } catch (error) {
        console.error("Failed to initialize Ruby:", error)
      }
    }
    initRuby()
  }, [])

  return (
    <div>
      <p>{rubyOutput}</p>
    </div>
  )
}

export default RubyComponent;