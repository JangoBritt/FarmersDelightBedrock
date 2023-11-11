import BlockEntity from "../../lib/BlockEntity";
import { vanillaItemList } from '../../data/recipe/skilletRecipe'
import { claerItem } from '../../lib/itemUtil';
import { gameMode } from "../../lib/EntityUtil";
import { ItemStack, world } from "@minecraft/server";

const scoreboard = world.scoreboard;

export function skillet(player, itemStack, block) {
    const location = block.location;
    const container = player.getComponent('inventory').container;
    const blockEntity = new BlockEntity(
        null,
        block,
        {
            location: location,
            type: 'farmersdelight:skillet'
        }
    );
    const V3 = { x: location.x + 0.5, y: location.y, z: location.z + 0.5 };
    const data = blockEntity.scoreboardObjective;
    const entity = blockEntity.entity;
    if (entity) {
        const itemStackData = blockEntity.getBlockEntityData('farmersdelight:blockEntityItemStackData');
        if (data && itemStackData) {
            const invItemStack = JSON.parse(itemStackData)['item'];
            if (vanillaItemList.includes(itemStack.typeId) || itemStack.hasTag('can_cooking')) {
                const itemAmount = itemStack.amount;
                if (invItemStack == 'undefined') {
                    entity.setDynamicProperty('farmersdelight:blockEntityItemStackData', `{"item":"${itemStack.typeId}"}`);
                    data.setScore('amount', itemAmount);
                    data.setScore(`${itemAmount}G`, 30);
                    if (gameMode(player)) {
                        claerItem(container, player.selectedSlot, itemAmount);
                    }
                } else if (itemStack.typeId == invItemStack) {
                    const maxAmount = itemStack.maxAmount;
                    const amount = data.getScore('amount');
                    const removeAmount = maxAmount - amount;
                    if (itemAmount <= removeAmount) {
                        data.setScore('amount', amount + itemAmount);
                        data.setScore(`${amount}G`, 30);
                        if (gameMode(player)) {
                            claerItem(container, player.selectedSlot, itemAmount);
                        }
                    } else {
                        data.setScore('amount', amount + removeAmount);
                        data.setScore(`${removeAmount}G`, 30);
                        if (gameMode(player)) {
                            claerItem(container, player.selectedSlot, removeAmount);
                        }
                    }
                }
            }
            if (itemStack.typeId != invItemStack && invItemStack != 'undefined') {
                for (const itemStackData of data.getScores()) {
                    const displayName = itemStackData.participant.displayName;
                    if (displayName != 'amount') {
                        const num = parseInt(displayName.split('G')[0]);
                        data.removeParticipant(displayName);
                        data.setScore('amount', data.getScore('amount') - num);
                        for (let i = 0; i < num; i++) {
                            entity.dimension.spawnItem(new ItemStack(invItemStack), entity.location);
                        }
                        break;
                    }
                }
                blockEntity.clearEntity();
                const skilletBlock = block.dimension.spawnEntity('farmersdelight:skillet', V3);
                scoreboard.addObjective(skilletBlock.id, skilletBlock.id).setScore('amount', 0);
                skilletBlock.setDynamicProperty('farmersdelight:blockEntityDataLocation', V3);
                skilletBlock.setDynamicProperty('farmersdelight:blockEntityItemStackData', '{"item":"undefined"}');
            }
        }
    }
}