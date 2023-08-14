import BlockEntity from "../../lib/BlockEntity";
import { farmersdelightBlockList, vanillaItemList } from '../../data/recipe/cuttingBoardRecipe'
import { claerItem, damageItem } from '../../lib/itemUtil';
import { MolangVariableMap, ItemStack } from "@minecraft/server";
import { gameMode } from "../../lib/EntityUtil";

const molang = new MolangVariableMap();

export function cuttingBoard(player, itemStack, block) {
    const location = block.location;
    const container = player.getComponent('inventory').container;
    const blockEntity = new BlockEntity(
        'farmersdelight:cutting_board',
        player.dimension,
        {
            location: location
        }
    );
    const entity = blockEntity.entity;
    const map = blockEntity.getDataMap('item');
    const V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 };
    if (map && !itemStack.hasTag('farmersdelight:is_knife')) {
        entity.dimension.spawnItem(new ItemStack(map.get('item')), entity.location);
        entity.triggerEvent('farmersdelight:despawn');
        player.dimension.spawnEntity('farmersdelight:cutting_board', V3).addTag(JSON.stringify(V3));
    }
    if (farmersdelightBlockList.includes(itemStack.typeId) || vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('farmersdelight:can_cut') || itemStack.hasTag('farmersdelight:is_knife')) {
        if (map) {
            if (itemStack.hasTag('farmersdelight:is_knife')) {
                const id = map.get('item').split(':')[1];
                player.runCommandAsync(`loot spawn ${location.x} ${location.y} ${location.z} loot "farmersdelight/cutting_board/farmersdelight_${id}"`);
                entity.triggerEvent('farmersdelight:despawn');
                player.dimension.spawnEntity('farmersdelight:cutting_board', V3).addTag(JSON.stringify(V3));
                if (gameMode(player)) {
                    damageItem(container, player.selectedSlot);
                }
            }
        } else if (!itemStack.hasTag('farmersdelight:is_knife')) {
            const id = itemStack.typeId.split(':');
            const name = id[0] == 'minecraft' ? `farmersdelight:${id[0]}_${id[1]}` : itemStack.typeId;
            entity.addTag(`{"item":"${itemStack.typeId}"}`);
            if (gameMode(player)) {
                claerItem(container, player.selectedSlot);
            }
            entity.dimension.spawnParticle(name, { x: location.x + 0.5, y: location.y + 0.0563, z: location.z + 0.5 }, molang);
        }
    }
}