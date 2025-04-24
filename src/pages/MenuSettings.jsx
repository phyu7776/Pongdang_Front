import { useEffect, useState } from 'react';
import { Settings, Menu, Plus, Edit2, Trash2, ChevronDown, ChevronUp, X, ChevronRight } from 'lucide-react';
import { menus } from '../api/endpoints';
import { ToasterConfig, showSuccessToast, showErrorToast } from '../components/common/Toast';
import { Dialog } from '@headlessui/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ menu, level, onEdit, onDelete, expandedMenus, toggleExpand, parentMenu, onUpdateMenu, sensors, onDragEnd, menuList, setMenuList }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = menu.children && menu.children.length > 0;
  const isExpanded = expandedMenus[menu.uid];

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div 
        className={`flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-zinc-700 ${
          level > 0 ? 'ml-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-600 before:to-transparent' : ''
        }`}
      >
        {hasChildren && (
          <button
            onClick={() => toggleExpand(menu)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded"
          >
            {isExpanded ? <ChevronDown size={16} className="text-gray-900 dark:text-white" /> : <ChevronRight size={16} className="text-gray-900 dark:text-white" />}
          </button>
        )}
        <div {...attributes} {...listeners} className="flex-1 cursor-grab active:cursor-grabbing">
          <span className="text-gray-900 dark:text-white">
            {menu.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {menu.restricted || '모든 사용자'}
          </span>
          <button
            onClick={() => onEdit(menu)}
            className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(menu.uid)}
            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4">
          <SortableContext items={menu.children.map(child => child.uid)} strategy={verticalListSortingStrategy}>
            {menu.children.map(child => (
              <SortableItem
                key={child.uid}
                menu={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                expandedMenus={expandedMenus}
                toggleExpand={toggleExpand}
                parentMenu={menu}
                onUpdateMenu={onUpdateMenu}
                sensors={sensors}
                onDragEnd={onDragEnd}
                menuList={menuList}
                setMenuList={setMenuList}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

const MenuSettings = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [editForm, setEditForm] = useState({
    name: '',
    path: '',
    icon: '',
    order: 0
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await menus.getFullMenuTree();
      setMenuList(response);
      setError(null);
    } catch (err) {
      setError('메뉴 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const findMenuAndParent = (menus, uid, parent = null) => {
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].uid === uid) {
          return { menu: menus[i], parent: menus, index: i, grandParent: parent };
        }
        if (menus[i].children && menus[i].children.length > 0) {
          const found = findMenuAndParent(menus[i].children, uid, menus[i]);
          if (found) return found;
        }
      }
      return null;
    };

    const activeMenu = findMenuAndParent(menuList, active.id);
    const overMenu = findMenuAndParent(menuList, over.id);

    if (!activeMenu || !overMenu) return;

    // 이동할 아이템 복사
    const movedItem = { ...activeMenu.menu };
    
    // 원래 위치에서 제거
    activeMenu.parent.splice(activeMenu.index, 1);
    
    // 새로운 위치에 삽입
    if (overMenu.parent === menuList) {
      // 상위로 이동 (루트 레벨)
      const targetIndex = overMenu.index;
      menuList.splice(targetIndex, 0, movedItem);
      movedItem.parentUid = null;
    } else if (activeMenu.parent === menuList) {
      // 하위로 이동
      overMenu.parent.splice(overMenu.index, 0, movedItem);
      movedItem.parentUid = overMenu.parent[0].uid;
    } else if (activeMenu.parent !== overMenu.parent) {
      // 다른 부모로 이동
      overMenu.parent.splice(overMenu.index, 0, movedItem);
      movedItem.parentUid = overMenu.parent[0].uid;
    } else {
      // 같은 레벨 내 이동
      overMenu.parent.splice(overMenu.index, 0, movedItem);
      movedItem.parentUid = overMenu.parent[0].parentUid;
    }

    setMenuList([...menuList]);
  };

  const handleUpdateMenu = (updatedMenu) => {
    const updateMenuInList = (menus) => {
      return menus.map(menu => {
        if (menu.uid === updatedMenu.uid) {
          return updatedMenu;
        }
        if (menu.children && menu.children.length > 0) {
          return {
            ...menu,
            children: updateMenuInList(menu.children)
          };
        }
        return menu;
      });
    };

    setMenuList(prevMenuList => updateMenuInList(prevMenuList));
  };

  const toggleExpand = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu.uid]: !prev[menu.uid]
    }));
  };

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setEditForm({
      name: menu.name,
      path: menu.url,
      icon: menu.icon,
      order: menu.order
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedMenu = {
        ...editingMenu,
        ...editForm
      };
      await menus.updateMenu(updatedMenu);
      setIsEditModalOpen(false);
      fetchMenus();
      showSuccessToast('메뉴가 수정되었습니다');
    } catch (err) {
      console.error('Error updating menu:', err);
      showErrorToast('메뉴 수정 중 오류가 발생했습니다');
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      await menus.deleteMenu(menuId);
      fetchMenus();
      showSuccessToast('메뉴가 삭제되었습니다');
    } catch (err) {
      console.error('Error deleting menu:', err);
      showErrorToast('메뉴 삭제 중 오류가 발생했습니다');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500">{error}</p>
      <button
        onClick={fetchMenus}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );

  return (
    <div className="p-8 bg-white dark:bg-zinc-800 min-h-screen">
      <ToasterConfig />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Menu className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            메뉴 설정
          </h1>
        </div>
        
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          메뉴 추가
        </button>
      </div>

      {/* Menu Tree */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={menuList.map(menu => menu.uid)} strategy={verticalListSortingStrategy}>
              {menuList.map(menu => (
                <SortableItem
                  key={menu.uid}
                  menu={menu}
                  level={0}
                  onEdit={handleEditMenu}
                  onDelete={handleDeleteMenu}
                  expandedMenus={expandedMenus}
                  toggleExpand={toggleExpand}
                  onUpdateMenu={handleUpdateMenu}
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                  menuList={menuList}
                  setMenuList={setMenuList}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Edit Menu Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white dark:bg-zinc-800 p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                {editingMenu ? '메뉴 수정' : '메뉴 추가'}
              </Dialog.Title>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  메뉴 이름
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  경로
                </label>
                <input
                  type="text"
                  value={editForm.path}
                  onChange={(e) => setEditForm(prev => ({ ...prev, path: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  아이콘
                </label>
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  순서
                </label>
                <input
                  type="number"
                  value={editForm.order}
                  onChange={(e) => setEditForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  저장
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MenuSettings; 