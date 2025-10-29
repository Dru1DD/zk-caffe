module caffee::caffee;

use std::string::String;
use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::event;

public struct LoyaltyCard has key, store {
    id: UID,
    owner: address,
    stamps_count: u8,
    image_url: String,
    total_visits: u64,
    free_coffees_earned: u64,
}

public struct CafeConfig has key {
    id: UID,
    cafe_owner: address,
    stamps_for_free_coffee: u8,
    coffee_price: u64,
    treasury: address,
}

const ENotOwner: u64 = 1;
const EInsufficientPayment: u64 = 2;
const ENoFreeCoffeeAvailable: u64 = 3;
const ENotCafeOwner: u64 = 4;

public struct StampAdded has copy, drop {
    card_id: ID,
    owner: address,
    stamps_count: u8,
    timestamp: u64,
}

public struct FreeCoffeeEarned has copy, drop {
    card_id: ID,
    owner: address,
    total_free_coffees: u64,
    timestamp: u64,
}

public struct CoffeeBought has copy, drop {
    card_id: ID,
    buyer: address,
    price: u64,
    timestamp: u64,
}

public struct FreeCoffeeRedeemed has copy, drop {
    card_id: ID,
    owner: address,
    timestamp: u64,
}

fun init(ctx: &mut TxContext) {
    let config = CafeConfig {
        id: object::new(ctx),
        cafe_owner: ctx.sender(),
        stamps_for_free_coffee: 8,
        coffee_price: 1_000_000,
        treasury: ctx.sender(),
    };
    transfer::share_object(config);
}

public entry fun create_loyalty_card(initial_image_url: String, ctx: &mut TxContext) {
    let card = LoyaltyCard {
        id: object::new(ctx),
        owner: ctx.sender(),
        stamps_count: 0,
        image_url: initial_image_url,
        total_visits: 0,
        free_coffees_earned: 0,
    };

    transfer::transfer(card, ctx.sender());
}

public entry fun add_stamp(
    card: &mut LoyaltyCard,
    config: &CafeConfig,
    new_image_url: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(card.owner == ctx.sender(), ENotOwner);

    card.stamps_count = card.stamps_count + 1;
    card.total_visits = card.total_visits + 1;
    card.image_url = new_image_url;

    let timestamp = clock::timestamp_ms(clock);

    event::emit(StampAdded {
        card_id: object::id(card),
        owner: card.owner,
        stamps_count: card.stamps_count,
        timestamp,
    });

    if (card.stamps_count >= config.stamps_for_free_coffee) {
        card.free_coffees_earned = card.free_coffees_earned + 1;
        card.stamps_count = 0;

        event::emit(FreeCoffeeEarned {
            card_id: object::id(card),
            owner: card.owner,
            total_free_coffees: card.free_coffees_earned,
            timestamp,
        });
    };
}

public entry fun buy_coffee<USDC>(
    card: &mut LoyaltyCard,
    config: &CafeConfig,
    payment: Coin<USDC>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(card.owner == ctx.sender(), ENotOwner);

    let payment_amount = coin::value(&payment);
    assert!(payment_amount >= config.coffee_price, EInsufficientPayment);

    transfer::public_transfer(payment, config.treasury);

    let timestamp = clock::timestamp_ms(clock);

    event::emit(CoffeeBought {
        card_id: object::id(card),
        buyer: card.owner,
        price: payment_amount,
        timestamp,
    });
}

public entry fun redeem_free_coffee(card: &mut LoyaltyCard, clock: &Clock, ctx: &mut TxContext) {
    assert!(card.owner == ctx.sender(), ENotOwner);
    assert!(card.free_coffees_earned > 0, ENoFreeCoffeeAvailable);

    card.free_coffees_earned = card.free_coffees_earned - 1;

    let timestamp = clock::timestamp_ms(clock);

    event::emit(FreeCoffeeRedeemed {
        card_id: object::id(card),
        owner: card.owner,
        timestamp,
    });
}

public entry fun update_config(
    config: &mut CafeConfig,
    new_price: u64,
    new_treasury: address,
    ctx: &mut TxContext,
) {
    assert!(config.cafe_owner == ctx.sender(), ENotCafeOwner);
    config.coffee_price = new_price;
    config.treasury = new_treasury;
}

public fun get_stamps_count(card: &LoyaltyCard): u8 {
    card.stamps_count
}

public fun get_free_coffees(card: &LoyaltyCard): u64 {
    card.free_coffees_earned
}

public fun get_total_visits(card: &LoyaltyCard): u64 {
    card.total_visits
}

public fun get_coffee_price(config: &CafeConfig): u64 {
    config.coffee_price
}

public fun get_config_id(config: &CafeConfig): ID {
    object::id(config)
}
