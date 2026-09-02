document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('skills-visualization');
    const slider = document.getElementById('skills-year-slider');
    const yearOnly = document.getElementById('skills-year-only');
    const yearValue = document.getElementById('skills-year-value');
    const yearLabel = document.getElementById('skills-year-label');
    if (!container || !slider || !yearOnly || !yearValue || !yearLabel) return;

    const cores = [
        { id: 'software', name: 'Software Development', x: 500, y: 380 },
        { id: 'data', name: 'Data Science', x: 250, y: 175 },
        { id: 'ml', name: 'Machine Learning', x: 750, y: 175 },
        { id: 'ai', name: 'Artificial Intelligence', x: 230, y: 595 },
        { id: 'quantum', name: 'Quantum Computing', x: 770, y: 595 }
    ];
    // Dates reflect the career periods already presented on the page.
    const skills = [
        ['Python', 2019, ['software', 'data', 'ml', 'ai', 'quantum']], ['Java', 2019, ['software']],
        ['C', 2019, ['software']], ['HTML', 2019, ['software']], ['CSS', 2019, ['software']],
        ['JavaScript', 2019, ['software']], ['Data Structures', 2019, ['software']], ['Git', 2019, ['software']],
        ['GitHub', 2019, ['software']], ['MySQL', 2019, ['software', 'data']], ['3D Modelling', 2019, ['software']],
        ['IoT', 2019, ['software']], ['AR / VR', 2019, ['software']], ['AWS', 2019, ['software']],
        ['Linear Regression', 2019, ['data']], ['Data Mining', 2019, ['data']], ['Quantum Mechanics', 2017, ['quantum']],
        ['Flask', 2023, ['software']], ['Pandas', 2023, ['data']], ['NumPy', 2023, ['data', 'ml']],
        ['Scikit-learn', 2023, ['ml']], ['Matplotlib', 2023, ['data']], ['Seaborn', 2023, ['data']],
        ['TensorFlow', 2023, ['ml', 'ai']], ['PyTorch', 2023, ['ml', 'ai']], ['OpenCV', 2023, ['ai']],
        ['Power BI', 2023, ['data']], ['Qiskit', 2023, ['quantum']], ['Cirq', 2023, ['quantum']],
        ['Q#', 2023, ['quantum']], ['Cloud Architecture', 2019, ['software']]
    ].map(function (skill, index) { return { id: 'skill-' + index, name: skill[0], year: skill[1], connections: skill[2] }; });

    function svgElement(tag, attributes, text) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.keys(attributes || {}).forEach(function (key) { element.setAttribute(key, attributes[key]); });
        if (text) element.textContent = text;
        return element;
    }

    function render() {
        const selectedYear = Number(slider.value);
        const visibleSkills = skills.filter(function (skill) {
            return yearOnly.checked ? skill.year === selectedYear : skill.year <= selectedYear;
        });
        yearValue.textContent = selectedYear;
        yearLabel.textContent = yearOnly.checked ? 'skills acquired this year' : 'skills acquired by this year';
        container.replaceChildren();

        const svg = svgElement('svg', { viewBox: '0 0 1000 800', role: 'img', 'aria-label': 'Skills network for ' + selectedYear });
        const activeCoreIds = new Set(visibleSkills.flatMap(function (skill) { return skill.connections; }));
        const positions = {};
        const coreCounts = {};
        visibleSkills.forEach(function (skill) {
            skill.connections.forEach(function (coreId) { coreCounts[coreId] = (coreCounts[coreId] || 0) + 1; });
        });
        const coreIndices = {};

        visibleSkills.forEach(function (skill) {
            skill.connections.forEach(function (coreId) {
                const core = cores.find(function (item) { return item.id === coreId; });
                const index = coreIndices[coreId] || 0;
                coreIndices[coreId] = index + 1;
                const angle = (Math.PI * 2 * index / coreCounts[coreId]) - Math.PI / 2;
                positions[skill.id + '-' + coreId] = { x: core.x + Math.cos(angle) * 160, y: core.y + Math.sin(angle) * 160, core: core };
            });
        });

        Object.keys(positions).forEach(function (id) {
            const position = positions[id];
            svg.appendChild(svgElement('line', { x1: position.x, y1: position.y, x2: position.core.x, y2: position.core.y, class: 'connection technical-connection' }));
        });
        cores.forEach(function (core) {
            if (!activeCoreIds.has(core.id)) return;
            const node = svgElement('g', { class: 'node core-competency', transform: 'translate(' + core.x + ' ' + core.y + ')' });
            node.appendChild(svgElement('circle', { r: 33 }));
            node.appendChild(svgElement('text', { 'text-anchor': 'middle', dy: '0.3em' }, core.name));
            svg.appendChild(node);
        });
        visibleSkills.forEach(function (skill) {
            skill.connections.forEach(function (coreId) {
                const position = positions[skill.id + '-' + coreId];
                const node = svgElement('g', { class: 'node technical-skill', transform: 'translate(' + position.x + ' ' + position.y + ')' });
                node.appendChild(svgElement('circle', { r: 20 }));
                node.appendChild(svgElement('title', {}, skill.name + ' — acquired ' + skill.year));
                node.appendChild(svgElement('text', { 'text-anchor': 'middle', dy: '0.3em' }, skill.name));
                svg.appendChild(node);
            });
        });
        if (!visibleSkills.length) {
            svg.appendChild(svgElement('text', { x: 500, y: 400, 'text-anchor': 'middle', class: 'skills-empty' }, 'No skills recorded for ' + selectedYear + '.'));
        }
        container.appendChild(svg);
    }

    slider.addEventListener('input', render);
    yearOnly.addEventListener('change', render);
    render();
});
