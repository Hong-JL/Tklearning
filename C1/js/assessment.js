document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessmentForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 收集所有评分
        const ratings = {
            rating1: form.rating1.value,
            rating2: form.rating2.value,
            rating3: form.rating3.value,
            rating4: form.rating4.value
        };
        
        // 检查是否所有项目都已评分
        const hasAllRatings = Object.values(ratings).every(rating => rating);
        
        if (!hasAllRatings) {
            alert('请为所有项目进行评分！');
            return;
        }
        
        // 计算平均分
        const average = Object.values(ratings)
            .reduce((sum, value) => sum + parseInt(value), 0) / Object.keys(ratings).length;
            
        // 显示提交成功消息
        alert(`评价提交成功！\n您的平均评分为：${average.toFixed(1)}分`);
        
        // 重置表单
        form.reset();
    });
}); 