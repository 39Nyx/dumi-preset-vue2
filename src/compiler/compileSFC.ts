import { parseComponent } from "vue-template-compiler";
import { COMP_IDENTIFIER, CompileOptions } from "@/compiler/index";

function generatorRenderFunction(template: string) {
    return `
import { compile as _compile } from 'vue-template-compiler';
function render(h) {
    const compiled = _compile(\`${template}\`);
    const fun = new Function(compiled.render);
    return fun.call(this);
}
`
}


export function compileSFC(options: CompileOptions) {
    const { code } = options;
    const parsed = parseComponent(code);
    let scriptContent = parsed.script ? parsed.script.content : 'export default {}';
    scriptContent = scriptContent.trim().replace('export default', '')
    let js = `const ${COMP_IDENTIFIER} = ${scriptContent}`;
    if (parsed.template) {
        js += generatorRenderFunction(parsed.template.content);
        js += `\n${COMP_IDENTIFIER}.render = render;`
    }
    return {
        js,
        css: ''
    }
}