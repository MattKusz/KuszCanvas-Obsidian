/** String keys are shared process-wide; symbols are created per owning
 * instance, which lets concurrent instances run the same named animation
 * independently. */
export type AnimationKey = string | symbol;
export type Animation<R extends object> = (params: {
    deltaTime: number;
    state?: R;
}) => R | null | undefined;
export type AnimationScheduler = Pick<Window, "requestAnimationFrame" | "cancelAnimationFrame" | "setTimeout" | "clearTimeout">;
export declare class AnimationController {
    private static scheduledFrames;
    private static animations;
    private static readonly schedulerCleanups;
    static start<R extends object>(key: AnimationKey, animation: Animation<R>, scheduler?: AnimationScheduler): void;
    private static scheduleNextFrame;
    private static cancelScheduledFrame;
    private static cancelScheduledFrameIfIdle;
    private static registerSchedulerCleanup;
    private static tick;
    static running(key: AnimationKey): boolean;
    static cancel(key: AnimationKey): void;
    static reset(): void;
}
