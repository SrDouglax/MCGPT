import { events } from "bdsx/event";
import { PlayerInteractEvent } from "bdsx/event_impl/entityevent";
import { storageManager } from "bdsx/storage";

type UserData = {
    selectedChatId: string
};

// Storage from the player
events.playerJoin.on(async ev => {
    const storage = await storageManager.get<UserData>(ev.player.getXuid()); // Using the asynchronized method.
    //  The synchronized method isn't recommended. ex) storageManager.getSync
    // The synchronized method pauses the entire server until the end of the load.
    if (!storage.isLoaded) return; // If the player left before loading, it's possible to occur.

    if (storage.data === undefined) {
        // Initialize player storage
        storage.init({
            selectedChatId: 'default'
        });
    }
});

events.playerLeft.on(async ev => {
    storageManager.close(ev.player);
});