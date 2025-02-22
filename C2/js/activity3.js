// 引入通用脚本
// 这里可以添加Activity 3的专用交互逻辑

// 全局变量
let totalPoints = 0;
const badges = [];
let scenarioAnswers = {
    1: false,
    2: false
};
let scenarioCount = 0;
let ratingCount = 0;

// 聊天评分系统
let ratedMessages = {
    1: false,
    2: false,
    3: false,
    4: false
};

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    initializeScenarioCards();
    initializeRatingSystem();
    initializeEnergyMachine();
    initializeStrategyStation();
    updatePointsDisplay();
});

// 场景卡片功能
function initializeScenarioCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const buttons = card.querySelectorAll('.vote-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleVote(btn, card);
            });
        });
    });
}

function handleVote(button, card) {
    const vote = button.dataset.vote === 'appropriate';
    const cardNumber = parseInt(card.dataset.scenario);
    
    // 记录答案
    scenarioAnswers[cardNumber] = true;

    // 判断答案是否正确（两个场景都是"不适合"）
    const isCorrect = !vote;
    
    if (isCorrect) {
        const correctResponses = [
            '哇！你真棒！这个时候确实不适合打扰别人呢！🌟',
            '太厉害了！你是个懂礼貌的小朋友！⭐',
            '答对啦！要记得保护他人的休息时间哦！🎉'
        ];
        const randomResponse = correctResponses[Math.floor(Math.random() * correctResponses.length)];
        addPoints(10); // 每个场景10分，总共20分
        showFeedback(randomResponse, 'success');
    } else {
        const wrongResponses = [
            '嗯...再想想看，这个时候会打扰到别人休息吗？🤔',
            '小朋友，换位思考一下，如果是你被打扰会开心吗？💭',
            '不对哦，要记得尊重他人的时间哦！😊'
        ];
        const randomResponse = wrongResponses[Math.floor(Math.random() * wrongResponses.length)];
        showFeedback(randomResponse, 'error');
    }

    // 禁用该卡片的按钮
    card.querySelectorAll('.vote-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });

    // 检查是否完成所有场景
    if (Object.values(scenarioAnswers).every(answered => answered)) {
        setTimeout(() => {
            showKnowledgeCard();
            addBadge('初级网络公民'); // 完成第一关获得徽章
        }, 1000);
    }
}

function showKnowledgeCard() {
    const knowledgeCard = document.querySelector('.knowledge-card');
    knowledgeCard.style.display = 'block';
    
    // 添加动画效果
    knowledgeCard.style.animation = 'popIn 0.5s ease-out';
    
    const closeButton = knowledgeCard.querySelector('.close-knowledge');
    closeButton.addEventListener('click', () => {
        knowledgeCard.style.animation = 'popOut 0.3s ease-out';
        setTimeout(() => {
            knowledgeCard.style.display = 'none';
        }, 300);
        addPoints(5);
        showFeedback('太棒了！你已经学会了一个重要的知识点！+5分 🌈', 'success');
    });
}

// 聊天模拟器功能
function initializeChatSimulator() {
    // 这个函数暂时不需要
}

function initializePrivacyGame() {
    // 这个函数暂时不需要
}

function initializeDebateSection() {
    // 这个函数暂时不需要
}

// 评分系统功能
function initializeRatingSystem() {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    ratingButtons.forEach(btn => {
        btn.addEventListener('click', () => handleRating(btn));
    });
}

function handleRating(button) {
    const user = button.dataset.user;
    const rating = button.classList.contains('like');
    const correctRatings = {
        '小明': true,  // 应该点赞
        '小强': false, // 应该踩
        '小美': true,  // 应该点赞
        '小张': false  // 应该踩
    };

    if (rating === correctRatings[user]) {
        const correctResponses = [
            '太棒了！你很懂得判断文明用语呢！🌟',
            '答对啦！你真是个有礼貌的小朋友！⭐',
            '真厉害！你很清楚什么是文明的交流方式！🎉'
        ];
        const randomResponse = correctResponses[Math.floor(Math.random() * correctResponses.length)];
        addPoints(10); // 每个评分10分，总共40分
        showFeedback(randomResponse, 'success');
    } else {
        const wrongResponses = [
            '再想想看，这样说话礼貌吗？🤔',
            '如果别人这样和你说话，你会开心吗？💭',
            '记住要用文明礼貌的语言交流哦！😊'
        ];
        const randomResponse = wrongResponses[Math.floor(Math.random() * wrongResponses.length)];
        showFeedback(randomResponse, 'error');
    }

    const ratingItem = button.closest('.rating-item');
    const buttons = ratingItem.querySelectorAll('.rating-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });

    if (Array.from(document.querySelectorAll('.rating-item')).every(item => 
        item.querySelector('.rating-btn').disabled
    )) {
        setTimeout(() => {
            showChatKnowledgeCard();
            addBadge('文明传播者'); // 完成第二关获得徽章
        }, 1000);
    }
}

function showChatKnowledgeCard() {
    const knowledgeCard = document.querySelector('.chat-knowledge-card');
    if (knowledgeCard) {
        knowledgeCard.style.display = 'block';
        addPoints(20); // 完成所有评分的额外奖励
    }
}

// 能量分类机功能
function initializeEnergyMachine() {
    const tags = document.querySelectorAll('.energy-machine .tag');
    const dropZones = document.querySelectorAll('.energy-machine .drop-zone');
    const resultMessage = document.querySelector('.energy-machine .result-message');
    let placedTags = new Map();

    tags.forEach(tag => {
        tag.setAttribute('draggable', 'true');
        tag.addEventListener('dragstart', dragStart);
        tag.addEventListener('dragend', dragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragleave', dragLeave);
        zone.addEventListener('drop', drop);
    });

    function dragStart(e) {
        e.target.classList.add('dragging');
        const tagData = {
            content: e.target.innerHTML,
            type: e.target.dataset.type,
            id: e.target.id || `tag-${Math.random()}`
        };
        e.dataTransfer.setData('application/json', JSON.stringify(tagData));
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('hover');
    }

    function dragLeave(e) {
        e.currentTarget.classList.remove('hover');
    }

    function drop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        zone.classList.remove('hover');
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const tag = document.querySelector('.energy-machine .tag:not(.placed)');
            
            if (tag) {
                const tagClone = document.createElement('div');
                tagClone.className = 'tag placed';
                tagClone.innerHTML = data.content;
                tagClone.dataset.type = data.type;
                
                tag.classList.add('placed');
                tag.style.display = 'none';
                
                zone.appendChild(tagClone);
                
                // 检查是否所有标签都已放置
                if (document.querySelectorAll('.energy-machine .tag:not(.placed)').length === 0) {
                    setTimeout(checkResult, 500);
                }
            }
        } catch (error) {
            console.error('Drop error:', error);
        }
    }

    function checkResult() {
        const placedTags = document.querySelectorAll('.energy-machine .drop-zone .tag.placed');
        let allCorrect = true;
        
        placedTags.forEach(tag => {
            const zone = tag.closest('.drop-zone');
            if (!zone || tag.dataset.type !== zone.dataset.type) {
                allCorrect = false;
            }
        });

        resultMessage.className = 'result-message';
        resultMessage.classList.add('show');
        
        if (allCorrect) {
            resultMessage.innerHTML = `
                <div class="card-content" style="text-align: center; padding: 2rem;">
                    <h4 style="color: #4CAF50; font-size: 1.4rem; margin-bottom: 1rem;">🎉 恭喜你！</h4>
                    <p style="color: #155724; font-size: 1.2rem;">你已经正确理解了网络社交的正负面影响！</p>
                </div>
            `;
            resultMessage.classList.add('success');
            addPoints(20);
        } else {
            resultMessage.innerHTML = `
                <div class="card-content" style="padding: 2rem; background: #f8f9fa; border-radius: 12px;">
                    <h4 style="color: #2196F3; text-align: center; font-size: 1.4rem; margin-bottom: 1.5rem;">💡 让我们看看正确答案</h4>
                    <div style="display: flex; justify-content: space-between; gap: 2rem;">
                        <div style="flex: 1; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <h4 style="color: #4CAF50; margin-bottom: 1rem; font-size: 1.2rem; text-align: center;">😊 正面影响</h4>
                            <div style="font-size: 1rem; line-height: 1.8;">
                                <p>👨‍🏫 小夏爷爷直播教中医知识</p>
                                <p>📚 在b站或抖音上学习新技能</p>
                                <p>❤️ 关注微博话题参与公益活动</p>
                                <p>🤝 小华在线帮助解答同学问题</p>
                            </div>
                        </div>
                        <div style="flex: 1; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <h4 style="color: #f44336; margin-bottom: 1rem; font-size: 1.2rem; text-align: center;">😔 负面影响</h4>
                            <div style="font-size: 1rem; line-height: 1.8;">
                                <p>😴 小明熬夜刷短视频导致上课睡觉</p>
                                <p>😢 在评论区网络欺凌他人</p>
                                <p>📱 过度依赖互联网解决问题</p>
                                <p>❌ 在留言区传播不实信息</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            resultMessage.classList.add('error');
        }
    }
}

// 能力加油站功能
function initializeStrategyStation() {
    const options = document.querySelectorAll('.strategy-station .option');
    const batterySections = document.querySelectorAll('.strategy-station .battery-section.empty');
    let placedOptions = new Map();

    options.forEach(option => {
        option.setAttribute('draggable', 'true');
        option.addEventListener('dragstart', dragStart);
        option.addEventListener('dragend', dragEnd);
    });

    batterySections.forEach(section => {
        section.addEventListener('dragover', dragOver);
        section.addEventListener('dragleave', dragLeave);
        section.addEventListener('drop', drop);
    });

    function dragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: e.target.dataset.type,
            target: e.target.dataset.target,
            content: e.target.innerHTML,
            id: e.target.id || `option-${Math.random()}`
        }));
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
        if (!e.currentTarget.classList.contains('filled')) {
            e.currentTarget.classList.add('hover');
        }
    }

    function dragLeave(e) {
        e.currentTarget.classList.remove('hover');
    }

    function drop(e) {
        e.preventDefault();
        const section = e.currentTarget;
        section.classList.remove('hover');
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const battery = section.closest('.battery');
            const problemSection = battery.querySelector('.battery-section[data-type="problem"]');
            const targetNumber = problemSection.textContent.trim().includes('总想刷短视频') ? '1' :
                               problemSection.textContent.trim().includes('通过网络学习新技能') ? '2' :
                               problemSection.textContent.trim().includes('网络欺凌') ? '3' : null;
            
            if (section.dataset.type === data.type && 
                !section.classList.contains('filled') && 
                data.target === targetNumber) {
                
                section.innerHTML = data.content;
                section.classList.remove('empty');
                section.classList.add('filled');
                
                const option = document.querySelector(`.strategy-station .option[data-target="${data.target}"][data-type="${data.type}"]:not(.placed)`);
                if (option) {
                    option.classList.add('placed');
                    option.style.display = 'none';
                }
                
                placedOptions.set(data.id, true);
                
                if (document.querySelectorAll('.strategy-station .option:not(.placed)').length === 0) {
                    showSuccess();
                }
            }
        } catch (error) {
            console.error('Drop error:', error);
        }
    }

    function showSuccess() {
        showFeedback('🎉 太棒了！你已经成功完成了所有能量电池的填充！', 'success');
        addPoints(30);
        addBadge('辩论大师'); // 完成能量加油站获得徽章
    }
}

// 工具函数
function addPoints(points) {
    totalPoints += points;
    updatePointsDisplay();
    checkBadges();
}

function updatePointsDisplay() {
    const pointsDisplay = document.getElementById('total-points');
    if (pointsDisplay) {
        pointsDisplay.textContent = totalPoints;
    }
}

function showFeedback(message, type) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${type}`;
    feedbackDiv.textContent = message;
    document.body.appendChild(feedbackDiv);

    // 添加动画
    setTimeout(() => {
        feedbackDiv.classList.add('show');
    }, 100);

    // 3秒后移除
    setTimeout(() => {
        feedbackDiv.classList.remove('show');
        setTimeout(() => {
            feedbackDiv.remove();
        }, 300);
    }, 3000);
}

function checkBadges() {
    const badgeThresholds = {
        '初级网络公民': 20,
        '文明传播者': 40,
        '隐私卫士': 60,
        '辩论大师': 80
    };

    for (const [badge, threshold] of Object.entries(badgeThresholds)) {
        if (totalPoints >= threshold && !badges.includes(badge)) {
            badges.push(badge);
            showFeedback(`🎉 恭喜获得新徽章：${badge}！`, 'success');
            updateBadgesDisplay();
        }
    }
}

function updateBadgesDisplay() {
    const container = document.querySelector('.badges-container');
    if (container) {
        container.innerHTML = '';
        badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.textContent = badge;
            container.appendChild(badgeElement);
        });
    }
}

function addBadge(badgeName) {
    if (!badges.includes(badgeName)) {
        badges.push(badgeName);
        showFeedback(`🎉 恭喜获得新徽章：${badgeName}！`, 'success');
        updateBadgesDisplay();
    }
}

// 更新积分系统
function updatePoints(points) {
    let currentPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
    currentPoints += points;
    localStorage.setItem('totalPoints', currentPoints);
    
    // 更新显示
    document.querySelector('.points-display').textContent = `当前积分：${currentPoints}`;
    
    // 检查并授予徽章
    checkAndAwardBadges(currentPoints);
}

function checkAndAwardBadges(totalPoints) {
    const badges = {
        'level1': {
            name: '初级网络公民',
            requirement: () => {
                return document.querySelectorAll('.correct-answer').length >= 2; // 第一关完成条件
            }
        },
        'level2': {
            name: '文明传播者',
            requirement: () => {
                return document.querySelectorAll('.rating-complete').length >= 4; // 第二关完成条件
            }
        },
        'energyMaster': {
            name: '能量大师',
            requirement: () => {
                return document.querySelector('.energy-machine').classList.contains('completed');
            }
        },
        'debateMaster': {
            name: '辩论大师',
            requirement: () => {
                return document.querySelector('.strategy-station').classList.contains('completed');
            }
        }
    };

    // 检查每个徽章
    Object.entries(badges).forEach(([key, badge]) => {
        if (badge.requirement() && !localStorage.getItem(`badge_${key}`)) {
            // 授予徽章
            localStorage.setItem(`badge_${key}`, 'true');
            showBadgeNotification(badge.name);
        }
    });
}

function showBadgeNotification(badgeName) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        ">
            🏆 恭喜获得徽章：${badgeName}！
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    const blocks = document.querySelectorAll('.block');
    const placeholders = document.querySelectorAll('.placeholder');
    const knowledgePoint = document.querySelector('.knowledge-point');
    let filledCount = 0;
    let firstPlaceholderItems = [];
    let secondPlaceholderItems = [];

    blocks.forEach(block => {
        block.addEventListener('dragstart', dragStart);
        block.addEventListener('dragend', dragEnd);
    });

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('dragover', dragOver);
        placeholder.addEventListener('dragleave', dragLeave);
        placeholder.addEventListener('drop', drop);
    });

    function dragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: e.target.dataset.type,
            content: e.target.innerHTML,
            id: Array.from(blocks).indexOf(e.target)
        }));
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
        const target = e.target.closest('.placeholder');
        if (target && !target.classList.contains('filled')) {
            target.classList.add('hover');
        }
    }

    function dragLeave(e) {
        const target = e.target.closest('.placeholder');
        if (target) {
            target.classList.remove('hover');
        }
    }

    function drop(e) {
        e.preventDefault();
        const target = e.target.closest('.placeholder');
        if (!target) return;
        
        target.classList.remove('hover');
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const type = data.type;
        const content = data.content;
        const blockId = data.id;
        
        // 检查是否放在正确的位置
        if (target.dataset.type === type) {
            if (type === 'info' && target === placeholders[0]) {
                // 第一个占位符最多接受3个积木
                if (firstPlaceholderItems.length < 3 && !firstPlaceholderItems.includes(blockId)) {
                    firstPlaceholderItems.push(blockId);
                    handleSuccessfulDrop(target, content, blockId);
                }
            } else if (type === 'bank' && target === placeholders[1]) {
                // 第二个占位符最多接受2个积木
                if (secondPlaceholderItems.length < 2 && !secondPlaceholderItems.includes(blockId)) {
                    secondPlaceholderItems.push(blockId);
                    handleSuccessfulDrop(target, content, blockId);
                }
            }
        }
    }

    function handleSuccessfulDrop(target, content, blockId) {
        // 更新占位符内容
        if (!target.querySelector('.dropped-items')) {
            target.innerHTML = '';
            const droppedItems = document.createElement('div');
            droppedItems.className = 'dropped-items';
            target.appendChild(droppedItems);
        }
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'dropped-item';
        itemDiv.innerHTML = content;
        target.querySelector('.dropped-items').appendChild(itemDiv);
        
        // 隐藏原始积木
        const originalBlock = blocks[blockId];
        if (originalBlock) {
            originalBlock.style.animation = 'popOut 0.3s ease-out forwards';
            setTimeout(() => {
                originalBlock.style.display = 'none';
            }, 300);
        }
        
        filledCount++;
        
        // 检查游戏是否完成
        checkGameCompletion();
    }

    function checkGameCompletion() {
        if (firstPlaceholderItems.length === 3 && secondPlaceholderItems.length === 2) {
            setTimeout(() => {
                showGameResult();
                addBadge('隐私卫士'); // 完成第三关获得徽章
            }, 500);
        }
    }

    function showGameResult() {
        // 清空积木区域并显示恭喜信息
        const blocksContainer = document.querySelector('.blocks-container');
        if (blocksContainer) {
            blocksContainer.innerHTML = `
                <div class="congratulation-message" style="
                    background-color: #ffebee;
                    color: #c62828;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    font-size: 1.2em;
                    margin-top: 20px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    animation: popIn 0.5s ease-out;
                ">
                    <h4 style="margin: 0 0 10px 0;">🎉 恭喜你！</h4>
                    <p style="margin: 0;">被诈骗巨额金钱，你变成了穷光蛋</p>
                </div>
            `;
        }
        
        // 显示失败消息
        const failureMessages = [
            '哎呀！要小心保护个人信息哦！🚫',
            '不要轻易相信陌生人的信息！⚠️',
            '记住要保护好自己的隐私！🔒'
        ];
        const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        showFeedback(randomMessage, 'error');
        
        // 显示知识点
        setTimeout(() => {
            knowledgePoint.classList.add('show');
        }, 1000);
    }
});

function showEnergyMachineResults(isCorrect, correctAnswers) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'energy-machine-results';
    resultsContainer.style.cssText = `
        margin: 20px auto;
        padding: 20px;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 800px;
    `;

    // 添加标题
    const title = document.createElement('h3');
    title.textContent = isCorrect ? '🎉 恭喜你全部正确！' : '💡 以下是正确答案参考：';
    title.style.cssText = `
        text-align: center;
        color: ${isCorrect ? '#4CAF50' : '#2196F3'};
        margin-bottom: 20px;
    `;
    resultsContainer.appendChild(title);

    // 创建两列布局
    const columnsContainer = document.createElement('div');
    columnsContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    `;

    // 正面影响列
    const positiveColumn = document.createElement('div');
    positiveColumn.innerHTML = `
        <h4 style="color: #4CAF50; margin-bottom: 10px; text-align: center;">✨ 正面影响</h4>
        <div style="background: #E8F5E9; padding: 15px; border-radius: 8px;">
            ${correctAnswers.positive.map(item => `
                <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 6px;">
                    ${item}
                </div>
            `).join('')}
        </div>
    `;

    // 负面影响列
    const negativeColumn = document.createElement('div');
    negativeColumn.innerHTML = `
        <h4 style="color: #F44336; margin-bottom: 10px; text-align: center;">⚠️ 负面影响</h4>
        <div style="background: #FFEBEE; padding: 15px; border-radius: 8px;">
            ${correctAnswers.negative.map(item => `
                <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 6px;">
                    ${item}
                </div>
            `).join('')}
        </div>
    `;

    columnsContainer.appendChild(positiveColumn);
    columnsContainer.appendChild(negativeColumn);
    resultsContainer.appendChild(columnsContainer);

    // 添加到页面
    const energyMachine = document.querySelector('.energy-machine');
    const existingResults = energyMachine.querySelector('.energy-machine-results');
    if (existingResults) {
        existingResults.remove();
    }
    energyMachine.appendChild(resultsContainer);

    // 更新积分
    if (isCorrect) {
        updatePoints(20);
        energyMachine.classList.add('completed');
    }
} 