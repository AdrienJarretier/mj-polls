function order_candidates(choices) {

    let ordered = [];
    for (let choice of choices) {
        ordered.push(choice.name);
    }

    return ordered;

}