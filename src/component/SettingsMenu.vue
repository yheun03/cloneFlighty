<script setup>
const groups = [
    { label: 'ALERTS', items: [{ icon: '◉', title: 'My Flights' }, { icon: '♧', title: 'Friends’ Flights' }] },
    { label: 'AUTOMATIONS', items: [{ icon: '▣', title: 'Calendar Sync' }] },
    { label: 'CUSTOMIZE', items: [{ icon: '☰', title: 'App Appearance' }] }
]
defineEmits(['select'])
</script>

<template>
    <div class="fc-settings">
        <h2>Settings</h2>
        <button class="fc-settings__pro" type="button" @click="$emit('select', 'pro')"><b>PRO</b><span><strong>Flighty
                    Pro</strong><small>Member</small></span>›</button>
        <div v-for="group in groups" :key="group.label" class="fc-settings__group">
            <h3>{{ group.label }}</h3><button v-for="item in group.items" :key="item.title" type="button"
                @click="$emit('select', item.title)"><span>{{ item.icon }}</span>{{ item.title }}<b>›</b></button>
        </div>
    </div>
</template>
