import { world, ItemStack } from "@minecraft/server";
import { RecipeHolder } from "../../lib/RecipeHolder";
import { location } from "../../lib/BlockEntity";
import { vanillaCookingPotRecipe } from "../../data/recipe/cookingPotRecipe";

const options = { entityTypes: ['farmersdelight:cooking_pot'], eventTypes: ['farmersdelight:cooking_pot_tick'] };

function potLoot(container, block, entity, blockLocation, id) {
    const cookingPotblock = new ItemStack('farmersdelight:cooking_pot');
    if (block) {
        if (JSON.stringify(entity.location) !== JSON.stringify(blockLocation)) {
            entity.teleport(blockLocation);
        }
    }
    if (block != id) {
        const itemStack = container.getItem(6);
        if (itemStack) {
            const typeId = itemStack.typeId;
            const amount = itemStack.amount;
            container.setItem(6, null);
            cookingPotblock.setLore([`§r§f目前的 ${amount} 份食物: ${typeId}`]);
        }
        entity.dimension.spawnItem(cookingPotblock, blockLocation);
        entity.triggerEvent('farmersdelight:despawn');
    }
}

function working(args) {
    const entity = args.entity;
    const dimension = entity?.dimension;
    const block = dimension.getBlock(entity.location);
    const stove = dimension.getBlock({ x: entity.location.x, y: entity.location.y - 1, z: entity.location.z })?.permutation?.getState('farmersdelight:is_working');
    if (block) {
        const map = new Map();
        const blockLocation = location(entity);
        const oldBlock = dimension.getBlock(blockLocation);
        const container = entity.getComponent('inventory').container;
        const recipes = vanillaCookingPotRecipe.recipe;
        const holder = new RecipeHolder(container, recipes, map.get('recipe') ?? 0);
        const index = holder.previewIndex;
        map.set('recipe', index);
        if (stove && index > -1) {
            const cookingTime = recipes[index].cookingtime;
            const progress = parseInt(entity.nameTag.split(':')[1]);
            console.warn(progress % cookingTime);
            if (progress % cookingTime == 0) {
                entity.nameTag = `cookingtime:1`;
                holder.consume();
            }else{
                entity.nameTag = `cookingtime:${progress + 1}`;
            }
        } else {
            entity.nameTag = 'cookingtime:0';
        }

        holder.output();
        potLoot(container, oldBlock.typeId, entity, blockLocation, 'farmersdelight:cooking_pot');
    }
}
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(working, options);