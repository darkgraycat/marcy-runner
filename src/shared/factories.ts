import { FieldsToInstance, Point, Size } from "./types";

/* Scenes */
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

        protected log(context: string, message: string, ...rest: any[]) {
            console.log(`${(performance.now() / 1000).toFixed(2).padStart(8, ' ')} [${this.constructor.name}: ${context}] ${message}`, ...rest);
            return this;
        }
    }
}



/* Entities */
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
            const [w, h] = config.size;
            const [x, y] = config.origin || [0, 0];
            scene.add
                .existing(this)
                .setSize(w, h)
                .setOrigin(x, y);
        }
    }
}

export function TileEntity(config: EntityConfig & { tilesize: Point }) {
    return class TileEntity extends Phaser.GameObjects.TileSprite {
        static readonly config = config;
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, 0, 0, config.key);
            const [w, h] = config.size;
            const [x, y] = config.origin || [0, 0];
            scene.add
                .existing(this)
                .setSize(w, h)
                .setOrigin(x, y);
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



/* Phys Entities */

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
            const [w, h] = config.size;
            const [x, y] = config.offset || [0, 0];
            scene.physics.add
                .existing(scene.add.existing(this), config.static)
                .setSize(w, h)
                .setOffset(x, y);
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
            const [w, h] = config.size;
            const [x, y] = config.offset || [0, 0];
            scene.physics.add
                .existing(scene.add.existing(this), config.static)
                .setSize(w, h);
            this.body.setOffset(x, y);
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



/* Groups & Containers */
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


type EntityContainerConfig<T extends EntityClass | PhysEntityClass> = {
    class: T | T[],
}

export function EntityContainer<T extends EntityClass | PhysEntityClass>(config: EntityContainerConfig<T>) {
    return class EntityContainer extends Phaser.GameObjects.Container {
        static readonly config = config;
        constructor(scene: Phaser.Scene, children?: (Phaser.GameObjects.Sprite | Phaser.Physics.Arcade.Sprite)[]) {
            super(scene, 0, 0, children);
            scene.add.existing(this);
        }
    }
}



/* Event names wrappers */
export type PointerEvent = 'pointerdown' | 'pointerdownoutside' | 'pointermove' | 'pointerout' | 'pointerover' | 'pointerup' | 'pointerupoutside' | 'wheel';

export type EntityEvent = 'gameobjectdown' | 'gameobjectmove' | 'gameobjectout' | 'gameobjectover' | 'gameobjectup';



/* User Interface */
export type UiElementConfig = {
    font: string,
    origin?: Point,
    scroll?: number,
}

export type UiElementEventHandler = (e?: Phaser.Input.Pointer) => void;

export function UiElement(config: UiElementConfig) {
    return class UiElement extends Phaser.GameObjects.BitmapText {
        static readonly config = config;
        constructor(scene: Phaser.Scene, text?: string) {
            super(scene, 0, 0, config.font, text);
            const [x, y] = config.origin || [0.5, 0.5];
            scene.add
                .existing(this)
                .setOrigin(x, y)
                .setDepth(1)
                .setScrollFactor(config.scroll || 0);
        }
        on(event: PointerEvent, handler: UiElementEventHandler, context?: any) {
            return super.on(event, handler, context);
        }
        removeListener(event: PointerEvent, handler?: Function, context?: any) {
            return super.removeListener(event, handler, context);
        }

    }
}

/* User Input */
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

