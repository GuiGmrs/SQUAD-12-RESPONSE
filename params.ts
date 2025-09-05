import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-params',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './params.html',
  styleUrls: ['./params.css']
})
export class ParamsComponent {
  method: string = 'GET';
  url: string = '';
  activeTab: string = 'params';

  params: { key: string; value: string; description: string }[] = [];
  headers: {key: string; value: string }[] = [];
  body: string = '';
  response: string = '';

  setTab(tab: string) {
    this.activeTab = tab;
  }

  addParam() {
    this.params.push({ key: '', value: '', description: '' });
  }

  removeParam(index: number) {
    this.params.splice(index, 1);
  }

  addHeader() {
    this.headers.push({ key: '', value: '' });
  }

  removeHeader(index: number) {
    this.headers.splice(index, 1);
  }

  async sendRequest() {
    let urlWithParams = this.url;

    if (this.params.length > 0) {
      const query = this.params
        .filter(p => p.key && p.value)
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&');
      if (query) {
        urlWithParams += (urlWithParams.includes('?') ? '&' : '?') + query;
      }
    }

    const headersObj: Record<string, string> = {};
    this.headers.forEach(h => {
      if (h.key && h.value) {
        headersObj[h.key] = h.value;
      }
    });

    try {
      const res = await fetch(urlWithParams, { 
        method: this.method,
        headers: headersObj,
        body: ['POST', 'PUT', 'PATCH'].includes(this.method.toUpperCase()) ? this.body : undefined
      });
    
      const text = await res.text();
      try {
        this.response = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        this.response = text;
      }
    } catch (err) {
      this.response = `❌ Erro: ${err}`;
    }
  }
}
