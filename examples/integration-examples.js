/**
 * أمثلة تكامل المكتبة مع إطارات العمل المختلفة
 */

// ================ React Example ================
const ReactExample = `
import React, { useEffect, useRef, useState } from 'react';
import ArabicMath from 'arabic-math-js';

function MathComponent({ equation, options = {} }) {
    const mathRef = useRef(null);
    const [arabicMath] = useState(() => new ArabicMath(options));
    
    useEffect(() => {
        if (mathRef.current && equation) {
            arabicMath.render(mathRef.current, equation);
        }
    }, [equation, arabicMath]);
    
    return (
        <div 
            ref={mathRef} 
            className="arabic-math"
            aria-label={\`معادلة رياضية: \${equation}\`}
        />
    );
}

// الاستخدام
function App() {
    const [equation, setEquation] = useState('sin(x) + cos(y) = 1');
    
    return (
        <div>
            <input 
                value={equation} 
                onChange={(e) => setEquation(e.target.value)}
                placeholder="اكتب معادلة..."
            />
            <MathComponent equation={equation} />
        </div>
    );
}

export default App;
`;

// ================ Vue Example ================
const VueExample = `
<template>
  <div>
    <input 
      v-model="equation" 
      placeholder="اكتب معادلة..."
      @input="debouncedRender"
    />
    <div 
      ref="mathContainer" 
      class="arabic-math"
      :aria-label="\`معادلة رياضية: \${equation}\`"
    ></div>
  </div>
</template>

<script>
import ArabicMath from 'arabic-math-js';
import { debounce } from 'lodash';

export default {
  name: 'MathComponent',
  
  props: {
    initialEquation: {
      type: String,
      default: 'sin(x) + cos(y) = 1'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  
  data() {
    return {
      equation: this.initialEquation,
      arabicMath: null
    };
  },
  
  mounted() {
    this.arabicMath = new ArabicMath(this.options);
    this.renderEquation();
  },
  
  methods: {
    renderEquation() {
      if (this.$refs.mathContainer && this.equation) {
        this.arabicMath.render(this.$refs.mathContainer, this.equation);
      }
    },
    
    debouncedRender: debounce(function() {
      this.renderEquation();
    }, 300)
  },
  
  watch: {
    equation() {
      this.renderEquation();
    }
  }
};
</script>
`;

// ================ Angular Example ================
const AngularExample = `
// math.component.ts
import { Component, ElementRef, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import ArabicMath from 'arabic-math-js';

@Component({
  selector: 'app-math',
  template: \`
    <div #mathContainer 
         class="arabic-math"
         [attr.aria-label]="'معادلة رياضية: ' + equation">
    </div>
  \`
})
export class MathComponent implements OnChanges, AfterViewInit {
  @Input() equation: string = '';
  @Input() options: any = {};
  @ViewChild('mathContainer', { static: true }) mathContainer!: ElementRef;
  
  private arabicMath: any;
  
  ngAfterViewInit() {
    this.arabicMath = new ArabicMath(this.options);
    this.renderEquation();
  }
  
  ngOnChanges() {
    if (this.arabicMath) {
      this.renderEquation();
    }
  }
  
  private renderEquation() {
    if (this.mathContainer && this.equation) {
      this.arabicMath.render(this.mathContainer.nativeElement, this.equation);
    }
  }
}

// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MathComponent } from './math.component';

@NgModule({
  declarations: [MathComponent],
  imports: [BrowserModule, FormsModule],
  exports: [MathComponent]
})
export class MathModule { }
`;

// ================ Svelte Example ================
const SvelteExample = `
<script>
  import { onMount, afterUpdate } from 'svelte';
  import ArabicMath from 'arabic-math-js';
  
  export let equation = 'sin(x) + cos(y) = 1';
  export let options = {};
  
  let mathContainer;
  let arabicMath;
  
  onMount(() => {
    arabicMath = new ArabicMath(options);
    renderEquation();
  });
  
  afterUpdate(() => {
    renderEquation();
  });
  
  function renderEquation() {
    if (mathContainer && equation && arabicMath) {
      arabicMath.render(mathContainer, equation);
    }
  }
</script>

<div 
  bind:this={mathContainer} 
  class="arabic-math"
  aria-label="معادلة رياضية: {equation}"
></div>
`;

// ================ Node.js Server Example ================
const NodeJSExample = `
const express = require('express');
const { JSDOM } = require('jsdom');

// إعداد بيئة DOM للخادم
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = window.document;

// تحميل المكتبة
const ArabicMath = require('arabic-math-js');

const app = express();napp.use(express.json());

// نقطة نهاية لترجمة المعادلات
app.post('/translate', async (req, res) => {
  try {
    const { equation, options = {} } = req.body;
    
    const arabicMath = new ArabicMath(options);
    const translated = arabicMath.translate(equation);
    
    res.json({
      success: true,
      original: equation,
      translated: translated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// نقطة نهاية لتوليد HTML مترجم
app.post('/render-html', async (req, res) => {
  try {
    const { equations, options = {} } = req.body;
    
    const arabicMath = new ArabicMath(options);
    const results = [];
    
    for (const equation of equations) {
      const container = document.createElement('div');
      await arabicMath.render(container, equation);
      
      results.push({
        original: equation,
        html: container.innerHTML
      });
    }
    
    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('خادم ترجمة المعادلات يعمل على المنفذ 3000');
});
`;

// ================ Electron Example ================
const ElectronExample = `
// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// renderer.js (في نافذة Electron)
const ArabicMath = require('arabic-math-js');

document.addEventListener('DOMContentLoaded', function() {
  const arabicMath = new ArabicMath({
    rtl: true,
    mathRenderer: 'mathjax'
  });
  
  // تطبيق سطح المكتب للترجمة
  const equationInput = document.getElementById('equation');
  const outputDiv = document.getElementById('output');
  const translateBtn = document.getElementById('translate');
  
  translateBtn.addEventListener('click', async () => {
    const equation = equationInput.value;
    if (equation.trim()) {
      await arabicMath.render(outputDiv, equation);
    }
  });
});
`;

// ================ WordPress Plugin Example ================
const WordPressExample = `
<?php
/**
 * Plugin Name: Arabic Math Equations
 * Description: ترجمة وعرض المعادلات الرياضية بالعربية
 */

// منع الوصول المباشر
if (!defined('ABSPATH')) {
    exit;
}

class ArabicMathPlugin {
    
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('arabic_math', array($this, 'math_shortcode'));
        add_action('wp_footer', array($this, 'init_script'));
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script(
            'mathjax',
            'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
            array(),
            '3.0.0',
            true
        );
        
        wp_enqueue_script(
            'arabic-math',
            plugin_dir_url(__FILE__) . 'js/arabic-math.min.js',
            array('mathjax'),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'arabic-math-style',
            plugin_dir_url(__FILE__) . 'css/arabic-math.min.css',
            array(),
            '1.0.0'
        );
    }
    
    public function math_shortcode($atts, $content = '') {
        $atts = shortcode_atts(array(
            'rtl' => 'true',
            'display' => 'inline'
        ), $atts);
        
        $class = 'arabic-math-equation';
        if ($atts['display'] === 'block') {
            $class .= ' math-display';
        }
        
        return sprintf(
            '<div class="%s" data-equation="%s">%s</div>',
            esc_attr($class),
            esc_attr($content),
            esc_html($content)
        );
    }
    
    public function init_script() {
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof ArabicMath !== 'undefined') {
                const arabicMath = new ArabicMath({
                    rtl: true,
                    mathRenderer: 'mathjax'
                });
                
                // ترجمة جميع المعادلات
                const equations = document.querySelectorAll('.arabic-math-equation');
                equations.forEach(eq => {
                    const equation = eq.getAttribute('data-equation');
                    if (equation) {
                        arabicMath.render(eq, equation);
                    }
                });
            }
        });
        </script>
        <?php
    }
}

new ArabicMathPlugin();
`;

// تصدير الأمثلة
if (typeof window !== 'undefined') {
  window.IntegrationExamples = {
      React: ReactExample,
      Vue: VueExample,
      Angular: AngularExample,
      Svelte: SvelteExample,
      NodeJS: NodeJSExample,
      Electron: ElectronExample,
      WordPress: WordPressExample
  };
}
