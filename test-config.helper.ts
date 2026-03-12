import { TestBed } from '@angular/core/testing';
import { Provider } from '@angular/core';

type CompilerOptions = Partial<{
  providers: Provider[];
  useJit: boolean;
  preserveWhitespaces: boolean;
}>;
export type ConfigureFn = (testBed: typeof TestBed) => void;

export const configureTests = (
  configure: ConfigureFn, 
  compilerOptions: CompilerOptions = {}
) => {
  const compilerConfig: CompilerOptions = {
    preserveWhitespaces: false,
    ...compilerOptions,
  };

  const configuredTestBed = TestBed.configureCompiler(compilerConfig);

  // @ts-ignore
  configure(configuredTestBed);

  // @ts-ignore
  return configuredTestBed.compileComponents().then(() => configuredTestBed);
};
