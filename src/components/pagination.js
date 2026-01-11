import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    // #2.3 — подготовить шаблон кнопки страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    return (data, state, action) => {
        // #2.1 — расчёт параметров пагинации
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        // #2.6 — обработка действий
        if (action) {
            switch (action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount;
                    break;
                default:
                    if (action.value) {
                        page = parseInt(action.value);
                    }
            }
            state.page = page;
        }

        // #2.4 — вывести кнопки страниц
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        // #2.5 — статус пагинации
        fromRow.textContent = (page - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min(page * rowsPerPage, data.length);
        totalRows.textContent = data.length;

        // #2.2 — срез данных
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    };
};