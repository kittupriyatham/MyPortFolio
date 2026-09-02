document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('skills-visualization');
    const slider = document.getElementById('skills-year-slider');
    const yearOnly = document.getElementById('skills-year-only');
    const yearValue = document.getElementById('skills-year-value');
    const yearLabel = document.getElementById('skills-year-label');
    if (!container || !slider || !yearOnly || !yearValue || !yearLabel) return;

    const GRAPH_CENTER = { x: 500, y: 340 };
    const CORE_ORBIT = 130;
    const VIEW_PADDING = 20;

    const cores = [
        { id: 'software', name: 'Software Dev', x: 500, y: 340 },
        { id: 'data', name: 'Data Science', x: 230, y: 155 },
        { id: 'ml', name: 'Machine Learning', x: 770, y: 155 },
        { id: 'ai', name: 'AI', x: 230, y: 525 },
        { id: 'quantum', name: 'Quantum', x: 770, y: 525 }
    ];

    // [name, year acquired, core connections]
    // Domains: 2004-2012 digital basics | 2017-2019 physics & early dev | 2019-2023 undergrad engineering
    //          2023-2025 AI/ML | 2025-2026 professional full-stack & OCR
    const skills = [
        // 2004-2012 — digital fundamentals
        ['Internet', 2004, ['software']],
        ['Web Browser', 2004, ['software']],
        ['Email', 2005, ['software']],
        ['MS Word', 2008, ['software']],
        ['MS Excel', 2008, ['software', 'data']],
        ['MS PowerPoint', 2008, ['software']],
        ['MS Paint', 2006, ['software']],
        ['C Programming', 2014, ['software']],

        // 2017-2019 — physics & early development
        ['Relativity', 2017, ['quantum']],
        ['Quantum Mechanics', 2017, ['quantum']],
        ['C Programming', 2017, ['software']],
        ['Particle Physics', 2018, ['quantum']],
        ['Digital Logic', 2018, ['software', 'quantum']],
        ['Android App Dev', 2018, ['software']],
        ['AutoCAD', 2019, ['software']],

        // 2019-2023 — B.Tech & engineering stack
        ['C Programming', 2019, ['software']],
        ['Java', 2019, ['software']],
        ['Python', 2019, ['software', 'data', 'ml']],
        ['HTML', 2019, ['software']],
        ['CSS', 2019, ['software']],
        ['JavaScript', 2019, ['software']],
        ['Git', 2019, ['software']],
        ['GitHub', 2019, ['software']],
        ['Regression', 2020, ['data']],
        ['AR / VR', 2020, ['software']],
        ['3D Printing', 2020, ['software']],
        ['IoT', 2020, ['software']],
        ['3D Modelling', 2020, ['software']],
        ['Data Structures', 2020, ['software']],
        ['MySQL', 2020, ['software', 'data']],
        ['Python Full Stack', 2021, ['software']],
        ['Data Science', 2021, ['data']],
        ['CAM', 2021, ['software']],
        ['Functional Programming', 2021, ['software']],
        ['Flask', 2022, ['software']],
        ['AWS', 2022, ['software']],
        ['Cloud Architecture', 2022, ['software']],
        ['Pandas', 2022, ['data']],
        ['NumPy', 2022, ['data', 'ml']],
        ['Data Mining', 2022, ['data']],
        ['C++', 2022, ['software']],
        ['Swift', 2022, ['software']],
        ['Objective-C', 2022, ['software']],
        ['SwiftUI', 2022, ['software']],
        ['Xcode', 2022, ['software']],
        ['iOS/MacOS/IpadOS App Dev', 2022, ['software']],

        // 2023-2025 — AI & machine learning
        ['AI', 2023, ['ai']],
        ['Machine Learning', 2023, ['ml']],
        ['Linear Regression', 2023, ['data', 'ml']],
        ['Scikit-learn', 2023, ['ml', 'data']],
        ['TensorFlow', 2023, ['ml', 'ai']],
        ['PyTorch', 2023, ['ml', 'ai']],
        ['Matplotlib', 2023, ['data']],
        ['Seaborn', 2023, ['data']],
        ['Qiskit', 2023, ['quantum']],
        ['Cirq', 2023, ['quantum']],
        ['Q#', 2023, ['quantum']],
        ['LLMs', 2024, ['ai', 'ml']],
        ['OpenCV', 2024, ['ai']],
        ['Power BI', 2024, ['data']],

        // 2025-2026 — professional full-stack & applied AI
        ['React', 2025, ['software']],
        ['Java Full Stack', 2025, ['software']],
        ['OCR', 2025, ['ai']],
        ['Azure', 2025, ['software', 'ml']],
        ['Docker', 2025, ['software']],
        ['Quantum Algorithms', 2026, ['quantum', 'software']]
    ].map(function (skill, index) {
        return { id: 'skill-' + index, name: skill[0], year: skill[1], connections: skill[2] };
    });

    function svgElement(tag, attributes, text) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.keys(attributes || {}).forEach(function (key) { element.setAttribute(key, attributes[key]); });
        if (text) element.textContent = text;
        return element;
    }

    function coreById(coreId) {
        return cores.find(function (item) { return item.id === coreId; });
    }

    function outwardAngle(core) {
        return Math.atan2(core.y - GRAPH_CENTER.y, core.x - GRAPH_CENTER.x);
    }

    function connectedCores(skill) {
        return skill.connections.map(coreById).filter(Boolean);
    }

    function nodeBounds(x, y, label, isCore) {
        const radius = isCore ? 30 : 15;
        const charWidth = isCore ? 5.2 : 4.6;
        const halfLabel = (label.length * charWidth) / 2;
        const halfHeight = isCore ? 22 : 16;
        return {
            minX: x - Math.max(radius, halfLabel),
            minY: y - Math.max(radius, halfHeight),
            maxX: x + Math.max(radius, halfLabel),
            maxY: y + Math.max(radius, halfHeight)
        };
    }

    function mergeBounds(boundsList) {
        return boundsList.reduce(function (acc, bounds) {
            return {
                minX: Math.min(acc.minX, bounds.minX),
                minY: Math.min(acc.minY, bounds.minY),
                maxX: Math.max(acc.maxX, bounds.maxX),
                maxY: Math.max(acc.maxY, bounds.maxY)
            };
        }, {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        });
    }

    function computeViewBox(positions, activeCoreIds, containerWidth, containerHeight) {
        const bounds = [];

        cores.forEach(function (core) {
            if (!activeCoreIds.has(core.id)) return;
            bounds.push(nodeBounds(core.x, core.y, core.name, true));
        });

        positions.forEach(function (position) {
            bounds.push(nodeBounds(position.x, position.y, position.skill.name, false));
        });

        if (!bounds.length) {
            return { x: 0, y: 0, width: 1000, height: 680 };
        }

        const merged = mergeBounds(bounds);
        const contentWidth = merged.maxX - merged.minX + VIEW_PADDING * 2;
        const contentHeight = merged.maxY - merged.minY + VIEW_PADDING * 2;
        const centerX = (merged.minX + merged.maxX) / 2;
        const centerY = (merged.minY + merged.maxY) / 2;
        const containerAspect = containerWidth > 0 && containerHeight > 0
            ? containerWidth / containerHeight
            : contentWidth / contentHeight;
        const contentAspect = contentWidth / contentHeight;

        let viewWidth = contentWidth;
        let viewHeight = contentHeight;

        if (contentAspect > containerAspect) {
            viewHeight = contentWidth / containerAspect;
        } else {
            viewWidth = contentHeight * containerAspect;
        }

        return {
            x: centerX - viewWidth / 2,
            y: centerY - viewHeight / 2,
            width: viewWidth,
            height: viewHeight
        };
    }

    function placeSkillsAroundCore(core, coreSkills) {
        const count = coreSkills.length;
        const isCenter = core.x === GRAPH_CENTER.x && core.y === GRAPH_CENTER.y;

        return coreSkills.map(function (skill, index) {
            let angle;
            if (isCenter) {
                angle = -Math.PI / 2 + (2 * Math.PI * index / count);
            } else {
                const outward = outwardAngle(core);
                const arc = count === 1 ? 0 : Math.min(Math.PI * 1.55, 0.42 * count + 0.55);
                const t = count === 1 ? 0 : index / (count - 1);
                angle = outward - arc / 2 + arc * t;
            }

            return {
                skill: skill,
                x: core.x + Math.cos(angle) * CORE_ORBIT,
                y: core.y + Math.sin(angle) * CORE_ORBIT,
                cores: connectedCores(skill)
            };
        });
    }

    function buildPositions(visibleSkills) {
        const grouped = {};
        visibleSkills.forEach(function (skill) {
            const coreId = skill.connections[0];
            if (!grouped[coreId]) grouped[coreId] = [];
            grouped[coreId].push(skill);
        });

        const positions = [];
        cores.forEach(function (core) {
            const coreSkills = grouped[core.id] || [];
            coreSkills.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            positions.push.apply(positions, placeSkillsAroundCore(core, coreSkills));
        });
        return positions;
    }

    function render() {
        const selectedYear = Number(slider.value);
        const visibleSkills = skills.filter(function (skill) {
            return yearOnly.checked ? skill.year === selectedYear : skill.year <= selectedYear;
        });
        yearValue.textContent = selectedYear;
        yearLabel.textContent = yearOnly.checked ? 'skills acquired this year' : 'skills acquired by this year';
        container.replaceChildren();

        const activeCoreIds = new Set(visibleSkills.flatMap(function (skill) { return skill.connections; }));
        const positions = buildPositions(visibleSkills);
        const viewBox = computeViewBox(
            positions,
            activeCoreIds,
            container.clientWidth,
            container.clientHeight
        );

        const svg = svgElement('svg', {
            viewBox: viewBox.x + ' ' + viewBox.y + ' ' + viewBox.width + ' ' + viewBox.height,
            preserveAspectRatio: 'xMidYMid meet',
            role: 'img',
            'aria-label': 'Skills network for ' + selectedYear
        });

        positions.forEach(function (position) {
            position.cores.forEach(function (core) {
                svg.appendChild(svgElement('line', {
                    x1: position.x,
                    y1: position.y,
                    x2: core.x,
                    y2: core.y,
                    class: 'connection technical-connection'
                }));
            });
        });

        cores.forEach(function (core) {
            if (!activeCoreIds.has(core.id)) return;
            const node = svgElement('g', { class: 'node core-competency', transform: 'translate(' + core.x + ' ' + core.y + ')' });
            node.appendChild(svgElement('circle', { r: 30 }));
            node.appendChild(svgElement('text', { 'text-anchor': 'middle', dy: '0.3em' }, core.name));
            svg.appendChild(node);
        });

        positions.forEach(function (position) {
            const node = svgElement('g', {
                class: 'node technical-skill',
                transform: 'translate(' + position.x + ' ' + position.y + ')'
            });
            node.appendChild(svgElement('circle', { r: 15 }));
            node.appendChild(svgElement('title', {}, position.skill.name + ' — acquired ' + position.skill.year));
            node.appendChild(svgElement('text', { 'text-anchor': 'middle', dy: '0.3em' }, position.skill.name));
            svg.appendChild(node);
        });

        if (!visibleSkills.length) {
            svg.appendChild(svgElement('text', {
                x: GRAPH_CENTER.x,
                y: GRAPH_CENTER.y,
                'text-anchor': 'middle',
                class: 'skills-empty'
            }, 'No skills recorded for ' + selectedYear + '.'));
        }

        container.appendChild(svg);
    }

    slider.addEventListener('input', render);
    yearOnly.addEventListener('change', render);
    window.addEventListener('resize', render);
    render();
});
