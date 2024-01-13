import { GameMode } from "@minecraft/server";
export class EntityUtil {
    static gameMode(player) {
        const query = {
            type: "minecraft:player",
            name: player.nameTag,
            location: player.location,
            gameMode: GameMode.creative
        };
        const entities = player.dimension.getEntities(query);
        return !entities.length;
    }
}
//# sourceMappingURL=EntityUtil.js.map