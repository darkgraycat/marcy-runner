import Phaser from "phaser";



/* Common */
namespace Common {
    export type Size = [width: number, height: number];
    export type Point = [x: number, y: number];
}



/* Scenes */

export function Scene<Params>(key: string, defaultParams: Params) {
    return class Scene extends Phaser.Scene {
        static readonly defaultParams = defaultParams;
        static readonly key = key;
        protected params: Params;
        constructor() {
            super(key);
            this.params = defaultParams;
        }

        init(params: Params) {
            Object
                .entries(params)
                .forEach(([param, value]) => this.params[param] = value);
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

type EntityClass =
    ReturnType<typeof Entity> |
    ReturnType<typeof TileEntity>;

type EntityConfig = {
    key: string,
    size: Common.Size,
    origin: Common.Point
}

export function Entity(config: EntityConfig) {
    return class Entity extends Phaser.GameObjects.Sprite {
        static readonly config = config;
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, config.key);
            const [w, h] = config.size;
            const [x, y] = config.origin;
            scene.add
                .existing(this)
                .setSize(w, h)
                .setOrigin(x, y);
        }
    }
}

export function TileEntity(config: EntityConfig & { tilesize: number }) {
    return class TileEntity extends Phaser.GameObjects.TileSprite {
        static readonly config = config;
        static readonly tilesize = config.tilesize;
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, 0, 0, config.key);
            const [w, h] = config.size;
            const [x, y] = config.origin;
            scene.add
                .existing(this)
                .setSize(w, h)
                .setOrigin(x, y);
        }
        resize(cols: number, rows: number) {
            this.setSize(TileEntity.tilesize * cols, TileEntity.tilesize * rows);
            return this;
        }
        place(col: number, row: number) {
            this.setPosition(TileEntity.tilesize * col, TileEntity.tilesize * row);
            return this;
        }
    }
}



/* Phys Entities */

type PhysEntityClass =
    ReturnType<typeof PhysEntity> |
    ReturnType<typeof TilePhysEntity>;

type PhysEntityConfig = {
    key: string,
    size: Common.Size,         // TODO: fix. Currently size ignored if static = true
    offset: Common.Point,      // TODO: fix. Currently offset ignored if static = true
    static?: boolean,
}

export function PhysEntity(config: PhysEntityConfig) {
    return class PhysEntity extends Phaser.Physics.Arcade.Sprite {
        static readonly config = config;
        public body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, config.key);
            const [w, h] = config.size;
            const [x, y] = config.offset;
            scene.physics.add
                .existing(scene.add.existing(this), config.static)
                .setSize(w, h)
                .setOffset(x, y);
        }
    }
}

export function TilePhysEntity(config: PhysEntityConfig & { tilesize: number }) {
    return class TilePhysEntity extends Phaser.GameObjects.TileSprite {
        static readonly config = config;
        static readonly tilesize = config.tilesize;
        public body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
        constructor(scene: Phaser.Scene) {
            super(scene, 0, 0, 0, 0, config.key);
            const [w, h] = config.size;
            const [x, y] = config.offset;
            scene.physics.add
                .existing(scene.add.existing(this), config.static)
                .setSize(w, h);
            this.body.setOffset(x, y);
        }
        resize(cols: number, rows: number) {
            this.setSize(TilePhysEntity.tilesize * cols, TilePhysEntity.tilesize * rows);
            this.body.updateFromGameObject();
            return this;
        }
        place(col: number, row: number) {
            this.setPosition(TilePhysEntity.tilesize * col, TilePhysEntity.tilesize * row);
            this.body.updateFromGameObject();
            return this;
        }
    }
}



/* Groups */

type GroupEntityCallback<T extends EntityClass> = (entity: T) => void;

type GroupEntityConfig<T extends EntityClass> = {
    class: T;
    update: boolean;
    capacity: number;
    onCreate?: GroupEntityCallback<T>;
    onRemove?: GroupEntityCallback<T>;
}

export function GroupEntity<T extends EntityClass>(config: GroupEntityConfig<T>) {
    return class GroupEntity extends Phaser.GameObjects.Group {
        static readonly config = config;
        constructor(scene: Phaser.Scene, children?: Phaser.GameObjects.Sprite[] | Phaser.GameObjects.TileSprite[]) {
            super(scene, children, {
                classType: config.class,
                maxSize: config.capacity,
                runChildUpdate: config.update,
                createCallback: config.onCreate as any,
                removeCallback: config.onRemove as any,
            });
            scene.add.existing(this);
        }

        forEach<K = void>(callback: (child: T, index?: number) => K) {
            this.getChildren().forEach((go, i) => {
                callback(go as any, i)
            });
        }
    }
}


type GroupPhysEntityCallback<T extends PhysEntityClass> = (entity: T) => void;

type GroupPhysEntityConfig<T extends PhysEntityClass> = {
    class: T;
    update: boolean;
    capacity: number;
    onCreate?: GroupPhysEntityCallback<T>;
    onRemove?: GroupPhysEntityCallback<T>;
}

export function GroupPhysEntity<T extends PhysEntityClass>(config: GroupPhysEntityConfig<T>) {
    return class GroupPhysEntity extends Phaser.Physics.Arcade.Group {
        static readonly config = config;
        constructor(scene: Phaser.Scene, children?: Phaser.Physics.Arcade.Sprite[] | Phaser.GameObjects.TileSprite[]) {
            super(scene.physics.world, scene, children, {
                classType: config.class,
                maxSize: config.capacity,
                runChildUpdate: config.update,
                createCallback: config.onCreate as any,
                removeCallback: config.onRemove as any,
            });
            scene.add.existing(this);
        }

        forEach<K = void>(callback: (child: T, index?: number) => K) {
            this.getChildren().forEach((go, i) => {
                callback(go as any, i)
            });
        }
    }
}
