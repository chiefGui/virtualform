# Unreal Engine (5) Compendium

- [Unreal Engine (5) Compendium](#unreal-engine-5-compendium)
  - [Multiplayer](#multiplayer)
      - [Projectile Replication](#projectile-replication)


## Multiplayer

<details>
<summary><h3>Simulating poor connections (test with confidence!)</h3></summary>

Once upon a time, I used to test multiplayer with the default Unreal Engine options. This means my clients always felt as smooth as the server, which made me waste a lot of time trying to figure out why my game felt laggy when I played it with my friends online, in a production scenario.

One simple solution to get more accurate results is to simulate a network connection with a high latency and a high packet loss. This way, you can test your game with a more realistic scenario.

Thankfully, Unreal Engine makes it easy to simulate poor(er) connections. Just go to `Edit > Editor Preferences > Level Editor - Play` and look for the `Enable Network Emulation`. It's very likely that's disabled. Toggle it on and feel free to play with the latency and packet loss values.

The way I use it is:
- Do I need integrity/general gameplay? Always at `Average` values (ranging from 30ms to 60ms).
- Do I need to test how something would perform in a really bad situation? I go to `Bad` values (ranging from 100ms to 200ms). Sometimes I go even more extreme and just set the latency to 500ms.
- Do I need to just confirm if something is replicating correctly? I disable the option altogether.
</details>
<details>
<summary>

#### Projectile Replication

</summary>

Replicating projectiles (or anything that is spawned intensively) is quite tricky. Not because it's technically complicated,
but because it's easy to give the player a bad, clunky experience.

**Spawning from the server (❌ Not ideal)**

If your client asks the server (through a Server RPC) to spawn a projectile, the server will spawn it and then replicate it to all clients (that is, if the projectile is marked as `Replicates`). It works, but the player will feel a delay between the time he shoots and the time the projectile appears on the screen.

**Spawning on the client + the server (❌ Not ideal)**

You can spawn a projectile on the client and then ask the server to replicate it to all clients. The problem with this approach is that the player who instigated the projectile will see it twice: one for the one the own client spawned, and another one for the one the server replicated.

**Spawning with a dummy through Multicast (❌ Not ideal)**

It's easy to see solutions on the internet that involve two different projectiles: one for the actual projectile; and a second one for a clone, often referred to as "dummy".

To illustrate the approach:

1. The client who shoots spawns a local projectile (the actual projectile).
2. Then it asks the server (through a Server RPC) to `Multicast` a dummy projectile to all clients.
3. In the `Multicast` function, developers usually put a condition so the dummy projectile won't be spawned to the client who instigated it.

Visually speaking, this solution works and may be a great quick solution for prototypes or small games. However, for production, it's not ideal because when the server calls the `Multicast` RPC, it communicates to all clients, *including* the one who instigated the projectile. This means there's a waste of bandwidth: the server is sending a message to the client who instigated the projectile, and the client is receiving it, but it's not doing anything with it.

**With some C++ (✅ Ideal)**

There is this [AActor::IsNetRelevantFor](https://docs.unrealengine.com/5.1/en-US/API/Runtime/Engine/GameFramework/AActor/IsNetRelevantFor/) API, only exposed through C++ (don't worry about it, it's quite simple!) that allows you to control whether an actor is relevant for a specific client or not, which gives us space to say that an actor is relevant to everybody except the client who instigated it.

The benefits:

- No spawn lag,
- No double projectiles,
- No dummy projectiles,
- No bandwidth waste.

Let's see how it works.

1. Create a new `AActor` class, let's call it `ASuperProjectile`.
2. Reparent your projectile class to `ASuperProjectile`.
3. Then at `SuperProjectile.h`:

```cpp
virtual bool IsNetRelevantFor(const AActor* RealViewer, const AActor* ViewTarget, const FVector& SrcLocation) const override;
```

4. At `SuperProjectile.cpp`:

```cpp
bool ASuperProjectile::IsNetRelevantFor(const AActor* RealViewer, const AActor* ViewTarget, const FVector& SrcLocation) const
{
	const APlayerController* RealViewerController = Cast<APlayerController>(RealViewer);

	if (!IsValid(RealViewerController))
	{
		return Super::IsNetRelevantFor(RealViewer, ViewTarget, SrcLocation);
	}

    bool IsControllerTheInstigator = RealViewerController == this->GetInstigatorController();

	return IsControllerTheInstigator ? false : Super::IsNetRelevantFor(RealViewer, ViewTarget, SrcLocation);
}
```

*Please, pay attention to the `return` statement of the function.* In this specific, illustrative situation, we are returning `false` if the controller is the instigator, and using the parent's behavior otherwise. 

You can use whatever logic you want to decide whether an actor is relevant to a specific client or not. Keep in mind: irrelevant clients won't receive the actor, and the actor won't be replicated to them.

5. Mark your projectile actor as `Replicates`.
6. Now, when spawning your projectile, first spawn it locally, and then ask the server to spawn it again. Don't worry: if your logic at the `return` statement of the implementation of your `IsNetRelevantFor` method is correct, the server won't spawn the projectile to the client who instigated it.

**References**

- https://www.reddit.com/r/unrealengine/comments/vhjviy/comment/id8zm5t/?utm_source=share&utm_medium=web2x&context=3
- https://forums.unrealengine.com/t/how-do-i-spawn-actors-only-to-specific-clients/586252/3
- https://forums.unrealengine.com/t/projectile-replication-from-ue5-fps-template/676348/6
</details>
