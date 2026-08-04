import { 
    describe, 
    expect, 
    it, 
    vi, 
} from 'vitest';
import consola from 'consola';
import { ConsolaLogger, NoopLogger } from '../../../src/core/index.ts';

const LEVELS = ['debug', 'info', 'warn', 'error'] as const;

describe('src/core/logger', () => {
    describe('NoopLogger', () => {
        it('should swallow every level', () => {
            const logger = new NoopLogger();

            for (const level of LEVELS) {
                expect(() => logger[level]('some message')).not.toThrow();
            }
        });
    });

    describe('ConsolaLogger', () => {
        it('should delegate every level to consola', () => {
            const logger = new ConsolaLogger();

            for (const level of LEVELS) {
                const spy = vi.spyOn(consola, level).mockImplementation(() => {});

                logger[level]('some message');

                expect(spy).toHaveBeenCalledWith('some message');

                spy.mockRestore();
            }
        });
    });
});
