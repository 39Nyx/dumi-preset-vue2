import { BABEL_STANDALONE_CDN, getPkgPath, getPluginPath } from '@/shared';
import type { IApi } from 'dumi';
import { fsExtra } from 'dumi/plugin-utils';
import { join } from 'path';
import { VueJSXTechStack } from './jsx';
import { VueSfcTechStack } from './sfc';

const RENDERER_FILENAME = 'renderer.mjs';

export default function registerTechStack(api: IApi) {
  const vueConfig = api.userConfig?.vue;

  const pkgPath = getPkgPath('preset-vue2', api.cwd);

  const libPath = join(pkgPath, '/lib');

  // vue-related runtime files must be placed under .dumi
  // so that the correct dependencies can be referenced.
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: RENDERER_FILENAME,
      content: fsExtra.readFileSync(join(libPath, RENDERER_FILENAME), 'utf8'),
    });
  });

  const runtimeOpts = {
    rendererPath: getPluginPath(api, RENDERER_FILENAME)
  };

  // mark @babel/standalone as external
  api.addHTMLHeadScripts(() => {
    return [
      {
        src: vueConfig?.compiler?.babelStandaloneCDN || BABEL_STANDALONE_CDN,
        async: true,
      },
    ];
  });
  api.modifyConfig((memo) => {
    memo.externals = {
      ...memo.externals,
      '@babel/standalone': 'Babel',
    };
    return memo;
  });

  api.register({
    key: 'registerTechStack',
    stage: 0,
    fn: () => VueJSXTechStack(runtimeOpts),
  });

  api.register({
    key: 'registerTechStack',
    stage: 1,
    fn: () => VueSfcTechStack(runtimeOpts),
  });
}
