import { createComparison, defaultRules } from "../lib/compare.js";

// #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const wrapper = action.closest('[data-field]');
            const input = wrapper?.querySelector('input, select');

            if (input) {
                input.value = '';
                state[field] = '';
            }
        }

        // #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}