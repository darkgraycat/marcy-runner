import { FieldsToInstance, Point, Size } from "./types";


/* #Builders */
export type SpriteConfig = {
    key: string,
    size: Size,
    tilesize?: Size,
    body?: boolean,
    static?: boolean,
}

export function makeSprite(scene: Phaser.Scene, config: SpriteConfig) {
    const sprite = config.tilesize
        ? scene.add.tileSprite(0, 0, ...config.tilesize, config.key)
        : scene.add.sprite(0, 0, config.key);
    if (config.body) {
        scene.physics.add.existing(sprite, config.static)
    }
    sprite.setSize(...config.size);
    return sprite;
}


/* #Scenes */
export type SceneClass =
    ReturnType<typeof Scene>;

export function Scene<Params>(key: string, defaults: Params) {
    return class Scene extends Phaser.Scene {
        static readonly defaults = defaults;
        static readonly key = key;
        protected params: Params;
        constructor() {
            super(key);
            this.params = defaults;
        }

        init(params: Params) {
            //Object
            //    .entries(params)
            //    .forEach(([param, value]) => this.params[param] = value);
            this.params = {
                ...this.params,
                ...params,
            };
            this.log('init', 'invoked', this.params);
        }

        create() {
            this.log('create', 'invoked');
        }

        protected log(context: string, message: string | number, ...rest: any[]) {
            console.log(`${(performance.now() / 1000).toFixed(2).padStart(8, ' ')} [${this.constructor.name}: ${context}] ${message}`, ...rest);
            return this;
        }
    }
}


/* #Entities */
export type EntityClass =
    ReturnType<typeof Entity> |
    ReturnType<typeof TileEntity>;

export type EntityConfig = {
    key: string,
    size: Size,
    origin?: Point,
}

export function Entity(config: EntityConfig) {
    return class Entity extends Phaser.GameObjects.Sprite {
        static readonly config = config;
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, config.key);
            scene.add
                .existing(this)
                .setSize(...config.size)
                .setOrigin(...config.origin || [0, 0]);
        }
    }
}

export function TileEntity(config: EntityConfig & { tilesize: Point }) {
    return class TileEntity extends Phaser.GameObjects.TileSprite {
        static readonly config = config;
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, 0, 0, config.key);
            scene.add
                .existing(this)
                .setSize(...config.size)
                .setOrigin(...config.origin || [0, 0]);
        }
        resizeByTile(cols: number, rows: number) {
            return this.setSize(
                TileEntity.config.tilesize[0] * cols | 0,
                TileEntity.config.tilesize[1] * rows | 0,
            );
        }
        placeByTile(col: number, row: number) {
            return this.setPosition(
                TileEntity.config.tilesize[0] * col | 0,
                TileEntity.config.tilesize[1] * row | 0,
            );
        }
    }
}


/* #PhysEntities */
export type PhysEntityClass =
    ReturnType<typeof PhysEntity> |
    ReturnType<typeof TilePhysEntity>;

export type PhysEntityConfig = {
    key: string,
    size: Size,
    offset?: Point,
    static?: boolean,
}

export function PhysEntity(config: PhysEntityConfig) {
    return class PhysEntity extends Phaser.Physics.Arcade.Sprite {
        static readonly config = config;
        public body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, config.key);
            scene.physics.add
                .existing(scene.add.existing(this), config.static)
                .setSize(...config.size)
            this.body
                .setSize(...config.size)
                .setOffset(...config.offset || [0, 0]);
        }
        updateBody() {
            this.body.updateFromGameObject();
            return this;
        }
    }
}

export function TilePhysEntity(config: PhysEntityConfig & { tilesize: Point }) {
    return class TilePhysEntity extends Phaser.GameObjects.TileSprite {
        static readonly config = config;
        public body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, 0, 0, config.key);
            scene.physics.add
                .existing(scene.add.existing(this), config.static)
                .setSize(...config.size);
            this.body
                .setSize(...config.size)
                .setOffset(...config.offset || [0, 0]);
        }
        updateBody() {
            this.body.updateFromGameObject();
            return this;
        }
        resizeByTile(cols: number, rows: number) {
            return this.setSize(
                TilePhysEntity.config.tilesize[0] * cols | 0,
                TilePhysEntity.config.tilesize[1] * rows | 0,
            );
        }
        placeByTile(col: number, row: number) {
            return this.setPosition(
                TilePhysEntity.config.tilesize[0] * col | 0,
                TilePhysEntity.config.tilesize[1] * row | 0,
            );
        }
    }
}


/* #Other */
export type GroupEntityClass =
    ReturnType<typeof GroupEntity>;

export type GroupEntityCallback<T extends EntityClass | PhysEntityClass> = (entity: T) => void;

export type GroupEntityConfig<T extends EntityClass | PhysEntityClass> = {
    class: T;
    update?: boolean;
    capacity?: number;
    onCreate?: GroupEntityCallback<T>;
    onRemove?: GroupEntityCallback<T>;
}

export function GroupEntity<T extends EntityClass | PhysEntityClass>(config: GroupEntityConfig<T>) {
    return class GroupEntity extends Phaser.GameObjects.Group {
        static readonly config = config;
        constructor(scene: Phaser.Scene, children?: Phaser.GameObjects.Sprite[] | Phaser.GameObjects.TileSprite[]) {
            super(scene, children, {
                classType: config.class,
                maxSize: config.capacity || 100,
                runChildUpdate: config.update || false,
                createCallback: config.onCreate as any,
                removeCallback: config.onRemove as any,
            });
            scene.add.existing(this);
        }
        forEach<K = void>(callback: (child: InstanceType<T>, index?: number) => K) {
            this.getChildren().forEach((go, i) => {
                callback(go as any, i)
            });
        }
    }
}


type ContainerEntityConfig<T extends EntityClass | PhysEntityClass> = {
    class: T | T[],
}

export function ContainerEntity<T extends EntityClass | PhysEntityClass>(config: ContainerEntityConfig<T>) {
    return class ContainerEntity extends Phaser.GameObjects.Container {
        static readonly config = config;
        constructor(scene: Phaser.Scene, children?: (Phaser.GameObjects.Sprite | Phaser.Physics.Arcade.Sprite)[]) {
            super(scene, 0, 0, children);
            scene.add.existing(this);
        }
    }
}


/* #UserInterface */
export type PointerEvent = 'pointerdown' | 'pointerdownoutside' | 'pointermove' | 'pointerout' | 'pointerover' | 'pointerup' | 'pointerupoutside' | 'wheel';

export type EntityEvent = 'gameobjectdown' | 'gameobjectmove' | 'gameobjectout' | 'gameobjectover' | 'gameobjectup';

export type UiElementConfig = {
    font: string,
    origin?: Point,
    scroll?: number,
}

export type UiElementEventHandler = (e?: Phaser.Input.Pointer) => void;

export function UiElement(config: UiElementConfig) {
    return class UiElement extends Phaser.GameObjects.BitmapText {
        static readonly config = config;
        private relativeScaleXY: Point;
        private relativeOffsetXY: Point;
        constructor(scene: Phaser.Scene, text?: string) {
            super(scene, 0, 0, config.font, text);
            scene.add
                .existing(this)
                .setDepth(1)
                .setOrigin(...config.origin || [0.5])
                .setScrollFactor(config.scroll || 0);
        }
        on(event: PointerEvent, handler: UiElementEventHandler, context?: any) {
            return super.on(event, handler, context);
        }
        removeListener(event: PointerEvent, handler?: Function, context?: any) {
            return super.removeListener(event, handler, context);
        }
        setRelativePosition(x: number, y = x, ox = 0, oy = 0) {
            const { parentSize, gameSize } = this.scene.scale;

            const offsetRatio = (parentSize.width * gameSize.height) / (2 * parentSize.height);
            const relativeX = (gameSize.width / 2) + offsetRatio * (2 * x - 1);
            const relativeY = gameSize.height * y;

            this.relativeScaleXY = [x, y];
            this.relativeOffsetXY = [ox, oy];
            return super.setPosition(relativeX + ox, relativeY + oy);
        }
        updateRelativePosition() {
            const [x, y] = this.relativeScaleXY;
            const [ox, oy] = this.relativeOffsetXY;
            return this.setRelativePosition(x, y, ox, oy);
        }

    }
}


/* #UserInput */
// export type ControllerConfig<T> = {
//     keys: { [K in keyof T]: T[K] };
// }

// export function Controller<T extends object>(config: ControllerConfig<T>) {
//     return class Controller extends Phaser.Input.InputPlugin {
//         static readonly config = config;
// 
//         constructor(scene: Phaser.Scene) {
//             super(scene);
//             Object.assign(this, config);
//         }
//     } as { new(): FieldsToInstance<T> & { config: T } };
// }

export function Controller<T extends object>(config: T) {
    return class Controller extends Phaser.Input.InputPlugin {
        static readonly config = config;
        constructor(scene: Phaser.Scene) {
            super(scene);
            Object.assign(this, config);
        }
    } as {
        new(scene: Phaser.Scene): FieldsToInstance<T> & Phaser.Input.InputPlugin;
        config: T;
    };
}

