'use client';

import React, { useState } from 'react';
import TipTapPaginatedEditor from '../../../components/editor/TipTapPaginatedEditor';

export default function EditorAvancadoPage() {
  const [content, setContent] = useState(`
    <h1>Editor com Paginação Automática</h1>
    <p>Este é um exemplo de editor usando TipTap com paginação automática. Digite bastante texto para ver a paginação em ação!</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    <h2>Funcionalidades</h2>
    <ul>
      <li>Paginação automática em formato A4</li>
      <li>Formatação de texto (negrito, itálico, sublinhado)</li>
      <li>Alinhamento de texto (esquerda, centro, direita, justificado)</li>
      <li>Quebras de página manuais</li>
      <li>Margens ABNT (25mm)</li>
    </ul>
    <p>Continue digitando para ver como o texto é automaticamente dividido em páginas quando atinge o limite de altura de uma folha A4...</p>
  `);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    console.log('Conteúdo atualizado:', newContent);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editor Avançado com Paginação
        </h1>
        <p className="text-gray-600">
          Editor de texto com paginação automática em formato A4. 
          Digite bastante conteúdo para ver a paginação em ação!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <TipTapPaginatedEditor
          content={content}
          onChange={handleContentChange}
          editable={true}
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Instruções:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Digite bastante texto para ver a paginação automática</li>
          <li>• Use os botões da barra de ferramentas para formatação</li>
          <li>• Clique no botão 📄 para inserir quebras de página manuais</li>
          <li>• O editor usa dimensões A4 (210x297mm) com margens ABNT (25mm)</li>
          <li>• As quebras de página são mostradas com linhas tracejadas</li>
        </ul>
      </div>
    </div>
  );
} 