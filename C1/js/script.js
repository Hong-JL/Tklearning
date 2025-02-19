document.addEventListener('DOMContentLoaded', function() {
    // 导航交互逻辑
    initNavigation();
    
    // 只在 activity1.html 页面初始化时间线动画
    if (document.querySelector('.timeline-animation')) {
        initTimelineAnimation();
    }
    
    // 初始化阅读思考卡片交互
    if (document.querySelector('.cards-container')) {
        initReadingCards();
    }
    
    // 初始化态度选择系统（只在 activity2.html 页面）
    if (document.querySelector('.attitude-card')) {
        new EvaluationSystem();
    }
    
    // 初始化连线游戏（只在相应页面）
    if (document.querySelector('.drawing-container')) {
        new ConnectionGame();
    }
    
    // 初始化绘图游戏（只在相应页面）
    if (document.querySelector('#drawingCanvas')) {
        new DrawingGame();
    }
    
    // 初始化图片放大功能
    if (document.querySelector('.zoomable-image')) {
        initImageZoom();
    }

    // 初始化思维导图交互（只在 activity1.html 页面）
    if (document.querySelector('.mindmap-branches')) {
        initMindmap();
        // 直接显示思维导图小结区域
        const mindmapSection = document.querySelector('.mindmap-summary-section');
        if (mindmapSection) {
            mindmapSection.style.display = 'block';
        }
    }
});

// 导航逻辑
function initNavigation() {
    // 移除之前的点击事件处理，让链接正常工作
    document.querySelectorAll('.nav-link').forEach(link => {
        // 只处理当前页面的active状态
        const currentPath = window.location.pathname;
        const linkPath = link.getAttribute('href');
        
        // 如果当前页面路径包含链接路径（考虑到可能的子目录），则设置为active
        if (currentPath.includes(linkPath)) {
            link.classList.add('active');
        }
    });
}

// 阅读思考卡片交互初始化
function initReadingCards() {
    // 为每个单选按钮添加change事件监听
    document.querySelectorAll('.cards-container .card form input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const card = e.target.closest('.card');
            const form = e.target.closest('form');
            
            // 添加已回答标记
            card.classList.add('answered');
            
            // 显示追问
            const followUp = form.querySelector('.follow-up-question');
            if (followUp) {
                followUp.classList.remove('hidden');
                setTimeout(() => followUp.classList.add('show'), 100);
            }
            
            // 检查是否所有卡片都已选择
            checkAllCardsAnswered();
        });
    });

    // 为查看细节按钮添加点击事件
    document.querySelectorAll('.card button[type="button"]').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.closest('form').id.replace('-form', '');
            viewDetails(type);
        });
    });
}

function checkAllCardsAnswered() {
    const allCards = document.querySelectorAll('.cards-container .card');
    const answeredCards = document.querySelectorAll('.cards-container .card.answered');
    
    if (allCards.length === answeredCards.length) {
        const mindmapSection = document.querySelector('.mindmap-summary-section');
        if (mindmapSection) {
            mindmapSection.style.display = 'block';
            setTimeout(() => {
                mindmapSection.classList.add('show');
                
                // 添加点击图标的事件监听
                document.querySelectorAll('.click-icon').forEach(icon => {
                    icon.addEventListener('click', function() {
                        const branch = this.closest('.branch');
                        const detail = branch.querySelector('.branch-detail');
                        
                        // 显示详情并隐藏图标
                        detail.classList.remove('hidden');
                        detail.classList.add('show');
                        this.style.display = 'none';
                    });
                });
            }, 100);
        }
    }
}

// 图片放大功能初始化
function initImageZoom() {
    // 为所有可放大图片添加点击事件
    document.querySelectorAll('.zoomable-image').forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            if (modal && modalImg) {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
        });
    });

    // 添加关闭按钮事件
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            const modal = document.getElementById('imageModal');
            if (modal) {
                modal.style.display = "none";
            }
        });
    }
}

// 修改评价系统实现
class EvaluationSystem {
    constructor() {
        this.correctAnswers = {
            0: 'positive',
            1: 'positive',
            2: 'negative',
            3: 'negative'
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 为态度选择按钮添加点击事件
        document.querySelectorAll('.attitude-card .reaction-buttons button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.attitude-card');
                const buttons = card.querySelectorAll('.reaction-buttons button');
                
                // 移除当前卡片所有按钮的选中状态
                buttons.forEach(btn => btn.classList.remove('selected'));
                // 添加当前按钮的选中状态
                e.target.classList.add('selected');
                
                // 检查是否所有题目都已回答
                this.checkAllAnswered();
            });
        });

        // 为相关拓展区域的图片添加点击放大事件
        document.querySelectorAll('.extension-images img').forEach(img => {
            img.addEventListener('click', () => {
                this.showImageModal(img.src);
            });
        });
    }

    checkAllAnswered() {
        const cards = document.querySelectorAll('.attitude-card');
        const answeredCards = document.querySelectorAll('.attitude-card .reaction-buttons .selected');
        
        if (cards.length === answeredCards.length) {
            // 显示正确答案和相关拓展区域
            const summarySection = document.querySelector('.attitude-summary-section');
            if (summarySection) {
                summarySection.style.display = 'block';
                summarySection.classList.add('show');
                
                // 检查答案并更新显示
                this.checkAnswers();
                
                // 滚动到结果区域
                requestAnimationFrame(() => {
                    summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        }
    }

    checkAnswers() {
        const cards = document.querySelectorAll('.attitude-card');
        let correctCount = 0;
        
        // 对所有四道题进行判定
        cards.forEach((card, index) => {
            const selectedButton = card.querySelector('.reaction-buttons .selected');
            if (!selectedButton) return; // 如果没有选择，跳过
            
            const userAnswer = selectedButton.dataset.attitude;
            const isCorrect = userAnswer === this.correctAnswers[index];

            if (isCorrect) correctCount++;

            // 更新答案项的样式
            const answerItem = document.querySelector(`.answer-row:nth-child(${Math.floor(index/2) + 1}) .answer-item:nth-child(${index%2 + 1})`);
            if (answerItem) {
                answerItem.classList.add('show');
                answerItem.querySelector('.answer-text').innerHTML = `第${index + 1}题：${isCorrect ? '✅' : '❌'} (正确答案：${this.correctAnswers[index] === 'positive' ? '😊' : '😢'})`;
            }
        });

        // 更新总体结果提示
        const resultDiv = document.createElement('div');
        resultDiv.className = 'answer-result';
        resultDiv.innerHTML = `
            <div class="result-text">
                ${correctCount === 4 ? 
                    '🎉 恭喜你全部答对了！' : 
                    `👍 你答对了${correctCount}题，还需要继续努力哦！`}
            </div>
        `;
        
        const answerContent = document.querySelector('.answer-content');
        if (answerContent) {
            // 移除已存在的结果提示（如果有）
            const existingResult = answerContent.querySelector('.answer-result');
            if (existingResult) existingResult.remove();
            // 添加新的结果提示
            answerContent.appendChild(resultDiv);
            
            // 显示拓展内容
            const extensionContent = document.querySelector('.extension-content');
            if (extensionContent) {
                extensionContent.classList.add('show');
            }
        }
    }

    showImageModal(src) {
        // 移除已存在的模态框
        const existingModal = document.querySelector('.image-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 创建新的模态框
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <span class="close">&times;</span>
            <img src="${src}" alt="放大图片">
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // 关闭按钮事件
        modal.querySelector('.close').onclick = () => {
            modal.remove();
        };
        
        // 点击外部关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }
}

function initTimelineAnimation() {
    // 首先检查必要的元素是否存在
    const leftImages = document.querySelector('.left-images');
    const rightImages = document.querySelector('.right-images');
    const timelineImages = document.querySelectorAll('.timeline-image');
    const introText = document.querySelector('.intro-text');
    
    // 如果不在 activity1 页面，这些元素可能不存在，直接返回
    if (!leftImages || !rightImages || !introText || timelineImages.length === 0) {
        return;
    }
    
    const textContent = introText.querySelector('p');
    if (!textContent) {
        return;
    }
    
    // 准备文字内容分段
    const textParts = [
        '人与人之间的交流，从一封信、',
        '一个电话，',
        '发展到一条信息、',
        '一个表情包、',
        '一段视频通话……',
        '现在，人们已经习惯于在线交流，方便又快捷。'
    ];
    
    // 重置状态
    leftImages.style.opacity = '0';
    rightImages.style.opacity = '0';
    timelineImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'translateY(20px)';
    });
    introText.style.opacity = '1';
    textContent.textContent = '';
    
    // 开始动画
    setTimeout(() => {
        leftImages.style.opacity = '1';
        rightImages.style.opacity = '1';
        let currentText = '';
        
        timelineImages.forEach((img, index) => {
            setTimeout(() => {
                // 显示图片
                img.style.opacity = '1';
                img.style.transform = 'translateY(0)';
                
                // 更新文字
                if (index < textParts.length - 1) {
                currentText += textParts[index];
                textContent.textContent = currentText;
                }
                
                // 最后一张图片显示完成后显示结束语
                if (index === timelineImages.length - 1) {
                    setTimeout(() => {
                        textContent.textContent += textParts[5];
                    }, 400);
                }
            }, index * 800);
        });
    }, 500);
}

// 添加窗口大小改变时的防抖处理
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initTimelineAnimation, 250);
});

// 按钮悬停效果
document.querySelector('button').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.05)';
});

document.querySelector('button').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});

// 连线游戏逻辑
class ConnectionGame {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.connections = [];
        this.isDrawing = false;
        this.startItem = null;
        this.currentLine = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.addEventListeners();
        this.showInitialTooltip();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
    }

    addEventListeners() {
        const items = document.querySelectorAll('.drawing-item');
        items.forEach(item => {
            item.addEventListener('mousedown', (e) => this.startConnection(e));
            item.addEventListener('mouseup', (e) => this.endConnection(e));
        });

        this.canvas.addEventListener('mousemove', (e) => this.drawConnection(e));
        
        document.getElementById('clearDrawing').addEventListener('click', () => this.clearConnections());
        document.getElementById('saveDrawing').addEventListener('click', () => this.saveConnections());

        // 添加窗口大小改变事件监听
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.drawExistingConnections();
        });
    }

    startConnection(e) {
        const item = e.target;
        if (item.classList.contains('drawing-item')) {
            this.isDrawing = true;
            this.startItem = item;
            item.classList.add('selected');
            
            const rect = item.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            this.currentLine = {
                startX: rect.left + rect.width/2 - canvasRect.left,
                startY: rect.top + rect.height/2 - canvasRect.top
            };
        }
    }

    drawConnection(e) {
        if (!this.isDrawing || !this.currentLine) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawExistingConnections();
        
        const canvasRect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - canvasRect.left;
        const endY = e.clientY - canvasRect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentLine.startX, this.currentLine.startY);
        
        // 添加贝塞尔曲线
        const controlX = (this.currentLine.startX + endX) / 2;
        this.ctx.bezierCurveTo(
            controlX, this.currentLine.startY,
            controlX, endY,
            endX, endY
        );
        
        this.ctx.stroke();
    }

    endConnection(e) {
        if (!this.isDrawing || !this.startItem) return;
        
        const endItem = e.target;
        if (endItem.classList.contains('drawing-item') && 
            this.isValidConnection(this.startItem, endItem)) {
            
            const startRect = this.startItem.getBoundingClientRect();
            const endRect = endItem.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            
            this.connections.push({
                from: this.startItem,
                to: endItem,
                startX: startRect.left + startRect.width/2 - canvasRect.left,
                startY: startRect.top + startRect.height/2 - canvasRect.top,
                endX: endRect.left + endRect.width/2 - canvasRect.left,
                endY: endRect.top + endRect.height/2 - canvasRect.top
            });
            
            endItem.classList.add('selected');
        }
        
        this.isDrawing = false;
        this.startItem = null;
        this.currentLine = null;
        this.drawExistingConnections();
    }

    isValidConnection(start, end) {
        // 检查是否在不同的列表中
        const startSide = start.closest('.left-side, .right-side');
        const endSide = end.closest('.left-side, .right-side');
        return startSide !== endSide;
    }

    drawExistingConnections() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.startX, conn.startY);
            
            // 添加贝塞尔曲线
            const controlX = (conn.startX + conn.endX) / 2;
            this.ctx.bezierCurveTo(
                controlX, conn.startY,
                controlX, conn.endY,
                conn.endX, conn.endY
            );
            
            this.ctx.stroke();
        });
    }

    clearConnections() {
        this.connections = [];
        document.querySelectorAll('.drawing-item').forEach(item => {
            item.classList.remove('selected');
        });
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.showTooltip('画布已清除，可以重新连线');
    }

    saveConnections() {
        if (this.connections.length === 0) {
            this.showTooltip('请先完成连线再保存');
            return;
        }
        
        const connectionData = this.connections.map(conn => ({
            from: conn.from.dataset.id,
            to: conn.to.dataset.id
        }));
        
        localStorage.setItem('connectionResults', JSON.stringify(connectionData));
        this.showTooltip('连线结果已保存');
    }

    showTooltip(message) {
        let tooltip = document.querySelector('.drawing-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'drawing-tooltip';
            this.canvas.parentElement.appendChild(tooltip);
        }
        
        tooltip.textContent = message;
        tooltip.classList.add('show');
        
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 3000);
    }

    showInitialTooltip() {
        this.showTooltip('请点击左侧案例，拖动连线到右侧对应的作用');
    }
}

class DrawingGame {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lines = [];
        this.currentLine = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.addEventListeners();
        this.showInitialTooltip();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        document.getElementById('clearDrawing').addEventListener('click', () => this.clearCanvas());
        document.getElementById('saveDrawing').addEventListener('click', () => this.saveDrawing());
        
        window.addEventListener('resize', () => this.handleResize());
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.currentLine = {
            points: [pos],
            color: this.ctx.strokeStyle
        };
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        this.currentLine.points.push(pos);
        
        this.redrawCanvas();
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            if (this.currentLine && this.currentLine.points.length > 1) {
                this.lines.push(this.currentLine);
            }
            this.currentLine = null;
        }
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制已保存的线
        this.lines.forEach(line => this.drawLine(line));
        
        // 绘制当前正在画的线
        if (this.currentLine) {
            this.drawLine(this.currentLine);
        }
    }

    drawLine(line) {
        if (line.points.length < 2) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(line.points[0].x, line.points[0].y);
        
        for (let i = 1; i < line.points.length; i++) {
            this.ctx.lineTo(line.points[i].x, line.points[i].y);
        }
        
        this.ctx.stroke();
    }

    clearCanvas() {
        this.lines = [];
        this.currentLine = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.showTooltip('画布已清除，可以重新绘制');
    }

    // 修改保存绘图方法
    saveDrawing() {
        // 获取整个连线区域
        const drawingArea = document.querySelector('.drawing-container');
        
        // 添加加载提示
        this.showTooltip('正在生成截图...');
        
        // 使用html2canvas截取整个区域
        html2canvas(drawingArea, {
            backgroundColor: '#ffffff',
            scale: 2, // 提高截图质量
            logging: false,
            useCORS: true, // 允许跨域图片
            onclone: (clonedDoc) => {
                // 确保克隆的DOM中canvas内容正确
                const clonedCanvas = clonedDoc.querySelector('#drawingCanvas');
                if (clonedCanvas) {
                    const originalCanvas = this.canvas;
                    const context = clonedCanvas.getContext('2d');
                    context.drawImage(originalCanvas, 0, 0);
                }
            }
        }).then(canvas => {
            // 将截图转换为图片并下载
            const link = document.createElement('a');
            link.download = '连线结果.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            this.showTooltip('连线结果已保存');
        }).catch(error => {
            console.error('截图生成失败:', error);
            this.showTooltip('保存失败，请重试');
        });
    }
    handleResize() {
        this.setupCanvas();
        this.redrawCanvas();
    }

    showInitialTooltip() {
        this.showTooltip('请用鼠标在画布上绘制连线');
    }

    showTooltip(message) {
        let tooltip = document.querySelector('.drawing-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'drawing-tooltip';
            this.canvas.parentElement.appendChild(tooltip);
        }
        
        tooltip.textContent = message;
        tooltip.classList.add('show');
        
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 3000);
    }
}

function initMindmap() {
    // 确保思维导图小结区域显示
    const mindmapSection = document.querySelector('.mindmap-summary-section');
    if (mindmapSection) {
        mindmapSection.style.display = 'block';
        mindmapSection.classList.add('show');
    }

    // 为每个分支的标题和图标添加点击事件
    document.querySelectorAll('.branch').forEach(branch => {
        const header = branch.querySelector('h4');
                    const detail = branch.querySelector('.branch-detail');
        const icon = branch.querySelector('.click-icon');

        if (header && detail && icon) {
            // 初始状态设置
            detail.classList.add('hidden');
            icon.style.display = 'inline-block';

            const toggleDetail = (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                
                if (detail.classList.contains('show')) {
                    // 如果已经显示，则隐藏
                    detail.classList.remove('show');
                    detail.classList.add('hidden');
                    icon.style.display = 'inline-block';
                } else {
                    // 如果隐藏，则显示
                        detail.classList.remove('hidden');
                        detail.classList.add('show');
                    icon.style.display = 'none';
                }
            };

            // 为标题和图标分别添加点击事件
            header.addEventListener('click', toggleDetail);
            icon.addEventListener('click', toggleDetail);
        }
    });
}

function createExampleModal(title, mediaPath, isVideo = false) {
    const modalHtml = `
        <div class="example-modal">
            <div class="example-content">
                <span class="example-close">&times;</span>
                <h4 class="example-title">${title}</h4>
                ${isVideo ? 
                    `<video class="example-media" controls>
                        <source src="${mediaPath}" type="video/mp4">
                        您的浏览器不支持视频播放。
                    </video>` :
                    `<img class="example-media" src="${mediaPath}" alt="${title}">`
                }
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.querySelector('.example-modal');
    modal.style.display = 'flex';

    // 关闭按钮事件
    modal.querySelector('.example-close').onclick = () => {
        modal.remove(); // 完全移除模态框
    };

    // 点击外部关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

function getSceneDetails(scene) {
    const details = {
        family: [
            ['视频通话', '实时分享，需确认对方是否方便'],
            ['微信发图', '异步交流，隐私性高（只有聊天对象可见）'],
            ['朋友圈晒图', '公开分享，时效性弱（要等他刷朋友圈）']
        ],
        school: [
            ['班级群发消息', '即时性强，适合紧急通知，易被刷屏和文件过期', 'video/1.jpeg'],
            ['电子邮件', '可以发送文件，单方面存在延时', 'video/2.mp4'],
            ['网盘链接+群公告', '兼顾文件共享与通知', 'video/3.mp4']
        ],
        park: [
            ['社区微信群', '精准触达邻居，但需注意群规'],
            ['朋友圈', '传播范围广，但可能打扰非相关人员'],
            ['微博+定位', '全网扩散，但需注意隐私暴露风险']
        ]
    };
    
    return details[scene].map(([tool, feature, mediaPath], index) => `
        <tr>
            <td>
                ${scene === 'school' ? 
                    `<span class="tool-icon" data-index="${index}" data-media="${mediaPath}">🤔</span>` : 
                    ''}
                <span class="tool-name">${tool}</span>
            </td>
            <td>${feature}</td>
        </tr>
    `).join('');
}

function createModal(scene) {
    const modalHtml = `
        <div class="modal" id="${scene}-modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>${getSceneTitle(scene)}</h3>
                ${scene === 'school' ? '<p class="modal-tip">可以试着点击下方文字前图标</p>' : ''}
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th width="30%">工具</th>
                            <th width="70%">特点</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${getSceneDetails(scene)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 为school场景添加图标点击事件
    if (scene === 'school') {
        const modal = document.getElementById(`${scene}-modal`);
        modal.querySelectorAll('.tool-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                this.classList.add('tool-icon-clicked');
                const index = parseInt(this.dataset.index);
                const mediaPath = this.dataset.media;
                
                // 根据索引显示不同的示例
                switch(index) {
                    case 0:
                        createExampleModal('班级群发消息示例', mediaPath, false);
                        break;
                    case 1:
                        createExampleModal('电子邮件的发与收消息示例', mediaPath, true);
                        break;
                    case 2:
                        createExampleModal('微信群公告的网盘链接下载', mediaPath, true);
                        break;
                }
            });
        });
    }
}

function getSceneTitle(scene) {
    const titles = {
        family: '家庭场景交流工具分析',
        school: '学校场景交流工具分析',
        park: '公园场景交流工具分析'
    };
    return titles[scene];
}

function viewDetails(scene) {
    const card = document.querySelector(`#${scene}-form`).closest('.card');
    
    // 创建并显示弹窗
    if (!document.getElementById(`${scene}-modal`)) {
        createModal(scene);
    }
    
    const modal = document.getElementById(`${scene}-modal`);
    modal.style.display = 'flex';
    
    // 关闭弹窗的点击事件
    modal.querySelector('.modal-close').onclick = () => {
        modal.style.display = 'none';
    };
    
    // 点击弹窗外部关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// 添加选项交互效果
document.querySelectorAll('.card form').forEach(form => {
    form.addEventListener('change', (e) => {
        // 添加已答状态
        e.target.closest('.card').classList.add('answered');
    });
});
