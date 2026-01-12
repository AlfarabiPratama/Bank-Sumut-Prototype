import React, { useState, useEffect, useCallback } from 'react';
import { Search, Command, ArrowRight, Users, Megaphone, Ticket, BarChart3 } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  category: 'navigation' | 'action' | 'search';
  icon: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onSearch?: (query: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'nav-executive',
      label: 'Go to Executive Dashboard',
      category: 'navigation',
      icon: <BarChart3 size={16} />,
      shortcut: 'E',
    },
    {
      id: 'nav-marketing',
      label: 'Go to Marketing Cloud',
      category: 'navigation',
      icon: <Megaphone size={16} />,
      shortcut: 'M',
    },
    {
      id: 'nav-sales',
      label: 'Go to Sales Cloud',
      category: 'navigation',
      icon: <Users size={16} />,
      shortcut: 'S',
    },
    {
      id: 'nav-service',
      label: 'Go to Service Cloud',
      category: 'navigation',
      icon: <Ticket size={16} />,
      shortcut: 'V',
    },
    {
      id: 'action-campaign',
      label: 'Create new campaign',
      category: 'action',
      icon: <Megaphone size={16} />,
    },
    {
      id: 'action-ticket',
      label: 'Create new ticket',
      category: 'action',
      icon: <Ticket size={16} />,
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].onSelect?.();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />

      {/* Command Palette Modal */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl z-[101]">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, customers, tickets..."
              className="flex-1 text-base outline-none bg-transparent"
              autoFocus
            />
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
              <Command size={12} />
              <span>K</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.onSelect?.();
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      selectedIndex === index
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`${selectedIndex === index ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {cmd.icon}
                    </span>
                    <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                    {cmd.shortcut && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
                        {cmd.shortcut}
                      </span>
                    )}
                    <ArrowRight size={14} className={`${selectedIndex === index ? 'text-indigo-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;
