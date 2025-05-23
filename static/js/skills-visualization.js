// Skills Visualization - Chemical Compound Style
document.addEventListener('DOMContentLoaded', function() {
    // Define the skills data structure
    const skillsData = {
        coreCompetencies: [
            { id: 'software-dev', name: 'Software Development', x: 500, y: 431 },
            { id: 'data-science', name: 'Data Science', x: 250, y: 170 },
            { id: 'machine-learning', name: 'Machine Learning', x: 750, y: 150 },
            { id: 'ai', name: 'Artificial Intelligence', x: 220, y: 600 },
            { id: 'quantum-computing', name: 'Quantum Computing', x: 780, y: 600 }
        ],
        technicalSkills: [
            { id: 'python', name: 'Python', connections: ['software-dev', 'data-science', 'machine-learning', 'ai', 'quantum-computing'] },
            { id: 'html', name: 'HTML', connections: ['software-dev'] },
            { id: 'css', name: 'CSS', connections: ['software-dev'] },
            { id: 'javascript', name: 'JavaScript', connections: ['software-dev'] },
            { id: 'flask', name: 'Flask', connections: ['software-dev'] },
            { id: 'pandas', name: 'Pandas', connections: ['data-science'] },
            { id: 'numpy', name: 'NumPy', connections: ['data-science', 'machine-learning'] },
            { id: 'scikit-learn', name: 'Scikit-learn', connections: ['machine-learning'] },
            { id: 'matplotlib', name: 'Matplotlib', connections: ['data-science'] },
            { id: 'opencv', name: 'OpenCV', connections: ['ai'] },
            { id: 'tensorflow', name: 'TensorFlow', connections: ['machine-learning', 'ai'] },
            { id: 'pytorch', name: 'PyTorch', connections: ['machine-learning', 'ai'] },
            { id: 'qiskit', name: 'Qiskit', connections: ['quantum-computing'] },
            { id: 'cirq', name: 'Cirq', connections: ['quantum-computing'] },
            { id: 'qsharp', name: 'Q#', connections: ['quantum-computing'] },
            { id: 'aws', name: 'AWS', connections: ['software-dev'] },
            { id: 'azure', name: 'Azure', connections: ['software-dev'] },
            { id: 'gcp', name: 'GCP', connections: ['software-dev'] },
            { id: 'mysql', name: 'MySQL', connections: ['software-dev', 'data-science'] },
            { id: 'mongodb', name: 'MongoDB', connections: ['software-dev'] },
            { id: 'seaborn', name: 'Seaborn', connections: ['data-science'] },
            { id: 'git', name: 'Git', connections: ['software-dev'] },
            { id: 'github', name: 'GitHub', connections: ['software-dev'] },
            { id: 'powerbi', name: 'Power BI', connections: ['data-science'] }
        ],
        softSkills: [
            { id: 'problem-solving', name: 'Problem-solving'},
            { id: 'adaptability', name: 'Adaptability'},
            { id: 'analytical', name: 'Analytical Skills'},
            { id: 'learning', name: 'Learning Ability'},
            { id: 'team-lead', name: 'Team-Lead'},
            { id: 'abstraction', name: 'Abstraction'},
            { id: 'team-player', name: 'Team Player'},
            { id: 'critical-thinking', name: 'Critical Thinking'}
        ]
    };

    // Initialize the visualization
    function initVisualization() {
        const container = document.getElementById('skills-visualization');
        if (!container) return;

        // Set up the SVG
        const width = container.clientWidth;
        const height = '800';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 1000 800`);
        container.appendChild(svg);

        // Create a group for all elements
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.appendChild(g);

        // Title will be added after the legend for static positioning

        // Create nodes for core competencies
        skillsData.coreCompetencies.forEach(skill => {
            const node = createNode(skill.x, skill.y, skill.name, 'core-competency', skill.id);
            g.appendChild(node);
        });

        // Position and create nodes for technical skills and store the instances
        const technicalSkillInstances = positionAndCreateNodes(skillsData.technicalSkills, 'technical-skill', g);

        // Position and create nodes for soft skills and store the instances
        const softSkillInstances = positionAndCreateNodes(skillsData.softSkills, 'soft-skill', g);

        // Create connections using the skill instances
        createConnections(g, technicalSkillInstances);

        // Add legend
        createLegend(svg);

        // Add zoom and pan functionality
        enableZoomAndPan(svg, g);
    }

    // Create a node (circle with text)
    function createNode(x, y, name, className, id) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `node ${className}`);
        group.setAttribute('data-id', id);
        group.setAttribute('transform', `translate(${x}, ${y})`);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', className === 'core-competency' ? 30 : 20);
        group.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.3em');
        text.setAttribute('fill', 'white'); // Set font color to white

        // Handle long text by splitting into multiple lines
        const words = name.split(' ');
        if (words.length > 1 && className !== 'core-competency') {
            text.setAttribute('dy', '-0.2em');
            words.forEach((word, i) => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.textContent = word;
                tspan.setAttribute('x', '0');
                tspan.setAttribute('dy', i === 0 ? '0' : '1.2em');
                text.appendChild(tspan);
            });
        } else {
            text.textContent = name;
        }

        group.appendChild(text);

        // Add hover effect
        group.addEventListener('mouseover', function() {
            this.classList.add('hover');
            highlightConnections(id);
        });

        group.addEventListener('mouseout', function() {
            this.classList.remove('hover');
            resetHighlights();
        });

        return group;
    }

    // Position nodes around their connected core competencies
    function positionAndCreateNodes(skills, className, container) {
        // Create a new array to store all skill instances (including duplicates)
        const skillInstances = [];

        // For soft skills, we'll handle them differently
        const isSoftSkill = className === 'soft-skill';

        // Count how many skills are connected to each core competency
        const coreConnectionCounts = {};
        if (!isSoftSkill) {
            skills.forEach(skill => {
                skill.connections.forEach(connId => {
                    coreConnectionCounts[connId] = (coreConnectionCounts[connId] || 0) + 1;
                });
            });
        }

        // Track the current angle index for each core
        const coreAngleIndices = {};

        skills.forEach((skill, index) => {
            if (skill.connections.length > 0 && !isSoftSkill) {
                // For technical skills, create a separate instance for each connection
                // Keep track of positions used for each core competency to avoid overlaps
                const corePositions = {};

                skill.connections.forEach((connId, connIndex) => {
                    const core = skillsData.coreCompetencies.find(c => c.id === connId);
                    if (core) {
                        // Initialize positions array for this core if not exists
                        if (!corePositions[connId]) {
                            corePositions[connId] = [];
                        }

                        // Initialize angle index for this core if not exists
                        if (coreAngleIndices[connId] === undefined) {
                            coreAngleIndices[connId] = 0;
                        }

                        // Calculate position around this specific core competency
                        let x, y;
                        let validPosition = false;

                        // Calculate the number of nodes connected to this core
                        const nodeCount = coreConnectionCounts[connId];

                        // Calculate the angle step to ensure minimum 30 degrees between nodes
                        // Convert 30 degrees to radians (π/6)
                        const minAngleInRadians = Math.PI / 6;

                        // Ensure we have at least the minimum angle between nodes
                        const angleStep = Math.max(minAngleInRadians, (Math.PI * 2) / nodeCount);

                        // Calculate the angle for this node
                        const angle = coreAngleIndices[connId] * angleStep;

                        // Increment the angle index for the next node
                        coreAngleIndices[connId]++;

                        // Randomize the distance a bit to create a more natural look
                        const distance = 120 + Math.random() * 40;
                        x = core.x + Math.cos(angle) * distance;
                        y = core.y + Math.sin(angle) * distance;

                        // Store this position
                        corePositions[connId].push({x, y});

                        // Create a unique ID for this instance
                        const instanceId = `${skill.id}-${connId}`;

                        // Create the node
                        const node = createNode(x, y, skill.name, className, instanceId);
                        container.appendChild(node);

                        // Store this instance for connection creation
                        skillInstances.push({
                            originalId: skill.id,
                            id: instanceId,
                            name: skill.name,
                            x: x,
                            y: y,
                            connection: connId
                        });
                    }
                });
            } else {
                // For soft skills or skills without connections, place them floating around
                // For soft skills, place them randomly around the canvas
                let x, y;

                if (isSoftSkill) {
                    // Place soft skills in a circular border around all clusters

                    // Calculate the center of the visualization (based on core competencies)
                    const centerX = 500; // Center of the canvas
                    const centerY = 430; // Center of the canvas

                    // Define a large radius that encompasses all clusters
                    // This creates a circular border around all the core competencies
                    const circleRadius = 550; // Significantly increased to ensure soft skills are completely outside all clusters

                    // Calculate the total number of soft skills
                    const totalSoftSkills = skillsData.softSkills.length;

                    // Distribute soft skills evenly around the circle
                    // Calculate the angle for this soft skill
                    const angleStep = (Math.PI * 2) / totalSoftSkills;
                    const angle = index * angleStep;

                    // Position the soft skill on the circle
                    x = centerX + Math.cos(angle) * circleRadius;
                    y = centerY + Math.sin(angle) * circleRadius;

                    // Ensure they stay within canvas bounds
                    x = Math.max(100, Math.min(850, x));
                    y = Math.max(0, Math.min(750, y));
                } else {
                    // For technical skills without connections, place randomly
                    x = 100 + Math.random() * 800;
                    y = 100 + Math.random() * 600;
                }

                // Create the node
                const node = createNode(x, y, skill.name, className, skill.id);
                container.appendChild(node);

                // Store this instance
                skillInstances.push({
                    originalId: skill.id,
                    id: skill.id,
                    name: skill.name,
                    x: x,
                    y: y
                });
            }
        });

        // Replace the original skills array with our instances array
        return skillInstances;
    }

    // Create connections between nodes
    function createConnections(container, technicalSkillInstances) {
        // Connect technical skill instances to their core competencies
        technicalSkillInstances.forEach(instance => {
            if (instance.connection) {
                const core = skillsData.coreCompetencies.find(c => c.id === instance.connection);
                if (core) {
                    const line = createConnection(instance.x, instance.y, core.x, core.y, 'technical-connection', instance.id, core.id);
                    container.insertBefore(line, container.firstChild); // Add lines to the back
                }
            }
        });

        // No connections for soft skills - they float freely
        // Soft skills will be highlighted when hovering over them, but won't have permanent connections
    }

    // Create a connection line
    function createConnection(x1, y1, x2, y2, className, fromId, toId) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', `connection ${className}`);
        line.setAttribute('data-from', fromId);
        line.setAttribute('data-to', toId);
        return line;
    }

    // Highlight connections for a node
    function highlightConnections(id) {
        // For core competencies, the ID remains the same
        // For skill instances, the ID is now in the format "originalId-connectionId"

        // Check if this is a core competency
        const isCoreCompetency = skillsData.coreCompetencies.some(core => core.id === id);

        if (isCoreCompetency) {
            // If it's a core competency, highlight all connections to this core
            const connections = document.querySelectorAll(`.connection[data-to="${id}"]`);
            connections.forEach(conn => {
                conn.classList.add('highlight');

                // Also highlight the connected skill node
                const fromId = conn.getAttribute('data-from');
                const skillNode = document.querySelector(`.node[data-id="${fromId}"]`);
                if (skillNode) {
                    skillNode.classList.add('connected');
                }
            });
        } else {
            // If it's a skill instance, highlight its connection to the core
            const connections = document.querySelectorAll(`.connection[data-from="${id}"]`);
            connections.forEach(conn => {
                conn.classList.add('highlight');

                // Also highlight the connected core node
                const toId = conn.getAttribute('data-to');
                const coreNode = document.querySelector(`.node[data-id="${toId}"]`);
                if (coreNode) {
                    coreNode.classList.add('connected');
                }
            });

            // If we want to highlight all instances of the same skill (optional)
            // Extract the original skill ID from the instance ID
            const originalId = id.split('-')[0];

            // Find all nodes that are instances of this skill
            document.querySelectorAll(`.node[data-id^="${originalId}-"]`).forEach(node => {
                if (node.getAttribute('data-id') !== id) { // Skip the current node
                    node.classList.add('same-skill');
                }
            });
        }
    }

    // Reset all highlights
    function resetHighlights() {
        document.querySelectorAll('.connection.highlight').forEach(el => {
            el.classList.remove('highlight');
        });

        document.querySelectorAll('.node.connected').forEach(el => {
            el.classList.remove('connected');
        });

        document.querySelectorAll('.node.same-skill').forEach(el => {
            el.classList.remove('same-skill');
        });
    }

    // Create a legend
    function createLegend(svg) {
        const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        legend.setAttribute('class', 'legend');
        legend.setAttribute('transform', 'translate(20, 20)');

        const types = [
            { class: 'core-competency', label: 'Core Competencies' },
            { class: 'technical-skill', label: 'Technical Skills' },
            { class: 'soft-skill', label: 'Soft Skills' }
        ];

        types.forEach((type, i) => {
            const item = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            item.setAttribute('transform', `translate(0, ${i * 25})`);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', 8);
            circle.setAttribute('class', type.class);
            item.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', 20);
            text.setAttribute('y', 5);
            text.setAttribute('fill', 'white'); // Set font color to white
            text.textContent = type.label;
            item.appendChild(text);

            legend.appendChild(item);
        });

        svg.appendChild(legend);

        // Add a static title centered horizontally in the canvas
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', '500'); // Center of the canvas horizontally
        title.setAttribute('y', '35');
        title.setAttribute('text-anchor', 'middle'); // Ensure proper centering
        title.setAttribute('fill', 'white'); // Set font color to white
        title.setAttribute('class', 'skills-title');
        title.textContent = 'Skills Visualization';
        svg.appendChild(title); // Add directly to SVG, not to the group that can be zoomed/panned
    }

    // Enable zoom and pan functionality
    function enableZoomAndPan(svg, g) {
        let isPanning = false;
        let startPoint = { x: 0, y: 0 };
        let endPoint = { x: 0, y: 0 };

        // Get the initial transform
        let transform = {
            x: 0,
            y: 0,
            scale: 1
        };

        // Update the transform
        function updateTransform() {
            g.setAttribute('transform', `translate(${transform.x}, ${transform.y}) scale(${transform.scale})`);
        }

        // Handle mouse wheel for zooming
        svg.addEventListener('wheel', function(event) {
            event.preventDefault();

            const delta = event.deltaY > 0 ? -0.1 : 0.1;
            transform.scale = Math.max(0.5, Math.min(2, transform.scale + delta));

            updateTransform();
        });

        // Handle mouse down for panning
        svg.addEventListener('mousedown', function(event) {
            if (event.button === 0) { // Left mouse button
                isPanning = true;
                startPoint = { x: event.clientX, y: event.clientY };
                svg.style.cursor = 'grabbing';
            }
        });

        // Handle mouse move for panning
        window.addEventListener('mousemove', function(event) {
            if (isPanning) {
                endPoint = { x: event.clientX, y: event.clientY };
                const dx = (endPoint.x - startPoint.x) / transform.scale;
                const dy = (endPoint.y - startPoint.y) / transform.scale;

                transform.x += dx;
                transform.y += dy;

                startPoint = endPoint;
                updateTransform();
            }
        });

        // Handle mouse up to stop panning
        window.addEventListener('mouseup', function() {
            if (isPanning) {
                isPanning = false;
                svg.style.cursor = 'default';
            }
        });
    }

    // Initialize when the page loads
    initVisualization();
});
