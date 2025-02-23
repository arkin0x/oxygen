import { ignitionPubkey, nostrocketIgnitionEvent } from "$lib/settings";
import type { Nostrocket } from "$lib/types";
import type { NDKEvent } from "@nostr-dev-kit/ndk";

export function validate(e: NDKEvent, state: Nostrocket): boolean {
  switch (e.kind) {
    case 15171031:
      return validate15171031(e, state);
    case 15172008:
      return validate15172008(e, state);
    case 30000:
      return validate30000(e, state);
  }
  return false;
}

function validate30000(e: NDKEvent, state: Nostrocket): boolean {
  if (e.kind == 30000) {
    if (state.RocketMap.get(nostrocketIgnitionEvent)?.isParticipant(e.pubkey)) {
      return true;
    }
    if (state.IdentityMap.get(e.pubkey)) {
      //todo get snapshot of current state and attempt to apply this state change
      return true;
    }
  }
  return false;
}

function validate15171031(e: NDKEvent, state: Nostrocket): boolean {
  if (e.kind == 15171031) {
    //check that signer is in identity tree
    if (state.IdentityMap.get(e.pubkey)) {
      //todo get snapshot of current state and attempt to apply this state change
      return true;
    }
  }
  return false;
}

function validate15172008(e: NDKEvent, state: Nostrocket): boolean {
  if (e.kind == 15172008) {
    //check that signer is in identity tree
    if (state.IdentityMap.get(e.pubkey)) {
      //validate signer has votepower
      if (e.pubkey == ignitionPubkey) {
        //todo get pubkey's votepower from current state instead of hardcoding the ignition account
        return true;
      }
      return false;
    }
  }
  return false;
}
