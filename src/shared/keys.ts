export const SceneKey = {
    Preload: "scene_preload",
    Main: "scene_main",
    Title: "scene_title",
    Level: "scene_level",
    Over: "scene_over",
    Tutorial: "scene_tutorial",
    Devmode: "scene_devmode",
}

export const SpriteKey = {
    Player: "sprite_player",
    EnemyDrone: "sprite_enemy_drone",
    Backgrounds: "sprite_backgrounds",
    Buildings: "sprite_buildings",
    BuildingRoofs: "sprite_building_roofs",
    BuildingDecors: "sprite_building_decors",
    Collectables: "sprite_collectables",
}

export const UiKey = {
    UiMenu: "ui_menu",
    Title: "ui_title",
    Logo: "ui_logo",
    LogoBig: "ui_logo_big",
}

export const AnimationKey = {
    PlayerWalk: "anim_player_walk",
    PlayerIdle: "anim_player_idle",
    PlayerJump: "anim_player_jump",
    PlayerBlink: "anim_player_blink",
    PlayerRun: "anim_player_run",

    EnemyDroneFly: "anim_enemy_drone_fly",
    EnemyDroneDie: "anim_enemy_drone_die",

    CollectablePanacatIdle: "anim_coll_panacat_idle",
    CollectablePanacatDie: "anim_coll_panacat_die",

    CollectableBeanIdle: "anim_coll_bean_idle",
    CollectableBeanDie: "anim_coll_bean_die",

    CollectableLifeIdle: "anim_coll_life_idle",
    CollectableLifeDie: "anim_coll_life_die",
}

export const AudioKey = {
    MainTheme: "audio_main",
    Collect: "audio_collect",
    Jump: "audio_jump",
    Warp: "audio_warp",
    Meow: "audio_meow"
}

export const FontKey = {
    MKitText: "font_mkit_text",
}

export const EventKey = {
    TitleStarted: "event_title_started",
    LevelStarted: "event_game_started",
    OverStarted: "event_over_started",
    TutorialStarted: "event_tutorial_started",
    DevmodeStarted: "event_devmode_started",

    BuildingSpawned: "event_building_spawned",
    ScreenResized: "event_screen_resized",
    FullScreenToggled: "event_fullscreen_toggled",
}
